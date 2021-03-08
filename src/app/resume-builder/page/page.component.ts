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
    constructor(public form2HtmlService: Form2HtmlService, private el: ElementRef) {}

    private get isContentOverflown(): boolean {
        return this.isOverflown(this.currentPlaceholder);
    }
    @Input() form: FormGroup;

    page: HTMLElement;
    component: HTMLElement;
    contentPlaceholders: NodeListOf<HTMLElement>;
    currentPlaceHolderIndex = 0;
    currentPlaceholder: HTMLElement;
    currentSectionHeader: HTMLElement;

    // currentNode: HTMLElement;
    currentNodeIndex = 0;
    elementArray: HTMLElement[] = [];
    currentUl: HTMLElement;
    currentLIs: HTMLElement[];
    liToAdd: HTMLElement;
    // currentLIindex: 0;

    observer = new MutationObserver((mutationsList, observer) => {
        setTimeout(() => {
            // Use traditional 'for loops' for IE 11
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if (mutation.removedNodes.length) {
                        // return;
                    } else {
                        if (this.currentLIs?.length) {
                            // debugger;
                            if (this.isOverflown(this.currentPlaceholder as HTMLElement)) {
                                // debugger;
                                this.currentUl.removeChild(this.liToAdd);
                                this.setNewCurrentPlaceholder();
                                this.currentUl = this.currentUl.cloneNode() as HTMLElement;
                                this.currentUl.appendChild(this.liToAdd);
                                this.currentPlaceholder.append(this.currentUl);
                                // this.liToAdd = this.currentLIs.shift();
                            } else {
                                if (this.currentLIs?.length) {
                                    this.liToAdd = this.currentLIs.shift();
                                    this.currentUl.appendChild(this.liToAdd);
                                }
                                // this.currentPlaceholder.append(this.currentUl);
                            }

                            return;
                        }

                        if (this.isOverflown(mutation.target as HTMLElement)) {
                            // debugger;
                            const ch = mutation.addedNodes[0];
                            this.currentPlaceholder.removeChild(ch);
                            this.setNewCurrentPlaceholder();
                            this.currentPlaceholder.append(ch);
                        } else {
                            ++this.currentNodeIndex;
                            // debugger;
                            if (!this.elementArray[this.currentNodeIndex]) {
                                // end
                                return;
                            }

                            const nodeToAdd: HTMLElement = this.elementArray[this.currentNodeIndex];

                            switch (nodeToAdd.tagName) {
                                case 'UL':
                                case 'OL':
                                    this.currentUl = nodeToAdd.cloneNode() as HTMLElement;
                                    this.currentLIs = Array.from(nodeToAdd.children) as HTMLElement[];

                                    if (this.currentLIs?.length) {
                                        this.liToAdd = this.currentLIs.shift();
                                        this.currentUl.appendChild(this.liToAdd);
                                        this.currentPlaceholder.append(this.currentUl);
                                    }
                                    break;
                                default:
                                    // mutation.target.appendChild(this.elementArray[this.currentNodeIndex]);
                                    this.currentPlaceholder.append(this.elementArray[this.currentNodeIndex]);
                                    break;
                            }
                        }
                        console.log('A child node has been added or removed.');
                    }

                    // break;
                }
            }
        });
    });

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.component = this.el.nativeElement;

        this.form.valueChanges
            .pipe(
                startWith(this.form.value),
                debounce(() => interval(200))
            )
            .subscribe((formValue: ResumeFormData) => {
                setTimeout(() => {
                    console.log(':::: formValue has changed');
                    this.clearNode(this.component);
                    this.currentSectionHeader = null;
                    this.elementArray = [];
                    this.currentNodeIndex = 0;

                    this.currentUl = null;
                    this.currentLIs = null;
                    // this.currentLIindex = 0;
                    this.liToAdd = null;

                    this.setupNewPage();

                    console.log(':::: convertForm2HTML started');
                    const formElements: HTMLElement[] = this.form2HtmlService.convertForm2HTML(formValue);
                    console.log(':::: convertForm2HTML ended');
                    this.elementArray.push(...formElements);

                    if (this.elementArray?.length) {
                        this.currentPlaceholder.appendChild(this.elementArray[this.currentNodeIndex]);
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
        this.component.prepend(this.page); //.appendChild(this.page);
        this.currentPlaceHolderIndex = 0;
        this.currentPlaceholder = this.contentPlaceholders[this.currentPlaceHolderIndex];

        this.contentPlaceholders.forEach((targetNode) => {
            this.observer.observe(targetNode, {
                characterData: true,
                attributes: false,
                childList: true,
                subtree: true,
            });
        });
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
