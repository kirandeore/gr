import { ResumeFormData } from './../interfaces/resume-form-model';
import { Form2HtmlService } from './../services/form-2-html.service';
import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { debounce, startWith } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit, AfterViewInit {
    @Input() form: FormGroup;

    page: HTMLElement;
    component: HTMLElement;
    contentPlaceholders: NodeListOf<HTMLElement>;
    currentPlaceHolderIndex = 0;
    currentPlaceholder: HTMLElement;
    currentSectionHeader: HTMLElement;

    constructor(public form2HtmlService: Form2HtmlService, private el: ElementRef) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.component = this.el.nativeElement;

        this.form.valueChanges
            .pipe(
                startWith(this.form.value),
                // debounce(() => interval(500))
            )
            .subscribe((formValue: ResumeFormData) => {
                this.clearNode(this.component);
                this.currentSectionHeader = null;

                this.setupNewPage();

                const elementArray: HTMLElement[] = [];
                const formElements: HTMLElement[] = this.form2HtmlService.convertForm2HTML(formValue);
                elementArray.push(...formElements);

                elementArray.forEach((ele) => {
                    switch (ele.tagName.toLowerCase()) {
                        case 'ul':
                        case 'ol':
                            const ulTag = ele;
                            const liTags: HTMLElement[] = Array.from(ulTag.children) as HTMLElement[];
                            let ulClone: HTMLElement = ulTag.cloneNode() as HTMLElement;

                            liTags.forEach((liTag) => {
                                let liClone: HTMLElement = liTag.cloneNode() as HTMLElement;
                                ulClone.appendChild(liClone);

                                this.currentPlaceholder.appendChild(ulClone);

                                // if dot is overflown
                                if (this.isContentOverflown) {
                                    ulClone.removeChild(liClone);

                                    // TODO: check spanArray[i] is not greater than any container, or else there will be infinite loop
                                    this.setNewCurrentPlaceholder();

                                    ulClone = ulTag.cloneNode() as HTMLElement;
                                    ulClone.appendChild(liClone);

                                    this.currentPlaceholder.appendChild(ulClone);
                                    // check if overflown
                                }

                                const wordTags: HTMLElement[] = Array.from(liTag.children) as HTMLElement[];

                                let isSentenceInComplete = false;

                                wordTags.forEach((wordTag) => {
                                    liClone.appendChild(wordTag);

                                    if (this.isContentOverflown) {
                                        isSentenceInComplete = true;
                                        liClone.removeChild(wordTag);

                                        ulClone = ulTag.cloneNode() as HTMLElement;
                                        liClone = liTag.cloneNode() as HTMLElement;
                                        ulClone.appendChild(liClone);
                                        liClone.appendChild(wordTag);

                                        // TODO: check spanArray[i] is not greater than any container, or else there will be infinite loop
                                        this.setNewCurrentPlaceholder();

                                        liClone.style.listStyleType = 'none';
                                        this.currentPlaceholder.appendChild(ulClone);
                                        // check if overflown
                                    }
                                });
                            });

                            break;
                        default:
                            if (ele.classList.contains('gr-section-header')) {
                                this.currentSectionHeader = ele;
                            }

                            this.currentPlaceholder.appendChild(ele);

                            if (this.isContentOverflown) {
                                // remove overflown content and reset counter
                                this.currentPlaceholder.removeChild(ele);

                                // TODO: check spanArray[i] is not greater than any container, or else there will be infinite loop
                                this.setNewCurrentPlaceholder();

                                this.currentPlaceholder.appendChild(ele);
                                // check if overflown
                            }

                            break;
                    }
                });
            });
    }

    private setNewCurrentPlaceholder() {
        // if current placeholder is last placeholder
        if (this.currentPlaceholder === this.contentPlaceholders[this.contentPlaceholders.length - 1]) {
            this.setupNewPage();
        } else {
            // no placeholder
            this.currentPlaceholder = this.contentPlaceholders[++this.currentPlaceHolderIndex];
        }

        if (this.currentSectionHeader) {
            this.currentPlaceholder.appendChild(this.currentSectionHeader.cloneNode(true));
            // check if overflown
        }
    }

    private setupNewPage() {
        this.page = this.createPage();
        this.contentPlaceholders = this.page.querySelectorAll('.content-placeholder');
        this.component.appendChild(this.page);
        this.currentPlaceHolderIndex = 0;
        this.currentPlaceholder = this.contentPlaceholders[this.currentPlaceHolderIndex];
    }

    private get isContentOverflown(): boolean {
        return this.isOverflown(this.currentPlaceholder);
    }

    private isOverflown({ clientWidth, clientHeight, scrollWidth, scrollHeight }): boolean {
        return scrollHeight > clientHeight || scrollWidth > clientWidth;
    }

    private clearNode(node: HTMLElement) {
        while (node.lastElementChild) {
            node.removeChild(node.lastElementChild);
        }
    }

    private createPage(): HTMLElement {
        const xmlString = `
    <div id="page" style="width: 8.5in; height: 11in; background-color: yellowgreen; zoom: 80%; display: flex; flex-flow: column; overflow: hidden;">
      <div id="header" style="flex: 0 1 auto; min-height: 200px; max-height: 300px; background-color: teal; overflow: hidden;"></div>
      <div id="body" style="padding: 0.5in 0.5in 0.5in 0.5in; background-color: bisque; flex: 1 1 auto; overflow: hidden;">
        <div style="width: 100%; overflow: hidden; height: 100%; display: flex; gap: 0.2in;">
          <div class="content-placeholder" style="background-color: whitesmoke; overflow: hidden; flex: 1"></div>
          <div class="content-placeholder" style="background-color: aquamarine; overflow: hidden; flex: 1"></div>
        </div>
      </div>
      <div id="footer" style="flex: 0 1 100px; min-height: 100px; background-color: coral;"></div>
    </div>
    `;

        const htmlDoc: Document = new DOMParser().parseFromString(xmlString, 'text/html');

        return htmlDoc.documentElement;
    }
}
