import { WorkExperience, ResumeFormData } from './../interfaces/resume-form-model';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class Form2HtmlService {
    constructor() {}

    convertForm2HTML(formData: ResumeFormData, template: String = null): HTMLElement[] {
        const elements: HTMLElement[] = [];
        const workExpHeaderDiv: HTMLDivElement = this.createSectionHeader(formData.workExpParentForm.header?.toString() || '');
        elements.push(workExpHeaderDiv);

        formData.workExpParentForm.workExps?.forEach((workExp) => {
            const jobHeader: HTMLDivElement = this.createJobHeader(workExp);
            const jobLocationDiv: HTMLDivElement = this.createJobLocation(workExp);
            const jobResponsibilities: HTMLElement[] = this.createWorkResponsibilites(workExp.description || '');

            elements.push(jobHeader);
            elements.push(jobLocationDiv);
            elements.push(...jobResponsibilities);
        });

        return elements;
    }

    private createWorkResponsibilites(description: String): HTMLElement[] {
        const responsibilitiesContainer: HTMLElement = new DOMParser().parseFromString(description?.toString() || '', 'text/html').documentElement;
        const immediateNodes: HTMLCollection = responsibilitiesContainer.querySelector('body')?.children;

        if (!immediateNodes) {
            return [];
        }

        Array.from(immediateNodes).forEach((immediateNode: Element) => {
            if (immediateNode.tagName.toLocaleLowerCase() === 'ul' || immediateNode.tagName.toLowerCase() === 'ol') {
                this.listTagToChunks(immediateNode as HTMLElement);
            }
        });

        return Array.from(immediateNodes) as HTMLElement[];
    }

    private listTagToChunks(ulTag: HTMLElement) {
        ulTag.style.wordBreak = 'break-word';

        Array.from(ulTag.children).forEach((li) => {
            Array.from(li.childNodes).forEach((node) => {
                if (node.nodeType === 3) {
                    const wordsSpanArray: HTMLElement[] = this.textToSpanArray(node.textContent || '');

                    wordsSpanArray.forEach((wordSpan) => {
                        li.insertBefore(wordSpan, node);
                    });

                    node.remove();
                }
            });
        });
    }

    private textToSpanArray(str: String): HTMLSpanElement[] {
        let span: HTMLSpanElement;
        let text: Text;
        const result: HTMLSpanElement[] = [];

        const createSpaceSpan = (): HTMLSpanElement => {
            const spaceSpan: HTMLSpanElement = document.createElement('span');
            const spaceText: Text = document.createTextNode(' ');
            spaceSpan.appendChild(spaceText);

            return spaceSpan;
        };

        str.split(' ').forEach((word) => {
            span = document.createElement('span');

            if (word === '') {
                text = document.createTextNode(' ');
            } else {
                text = document.createTextNode(word);
            }

            span.appendChild(text);

            result.push(...[span, createSpaceSpan()]);
        });

        return result;
    }

    private createJobLocation(workExp: WorkExperience): HTMLDivElement {
        const { company, state, city, country } = workExp;
        const jobLocationDiv: HTMLDivElement = this.createElement('div') as HTMLDivElement;
        const jobLocation = [company, city, state, country].map((value) => value).join(', ');

        jobLocationDiv.innerHTML = jobLocation;

        return jobLocationDiv;
    }

    private createJobHeader(workExp: WorkExperience): HTMLDivElement {
        const jobTitleDiv: HTMLDivElement = this.createJobTitle(workExp);
        const durationDiv: HTMLDivElement = this.createJobDuration(workExp);

        const jobHeader: HTMLDivElement = this.createElement('div') as HTMLDivElement;
        jobHeader.style.display = 'flex';
        jobHeader.style.justifyContent = 'space-between';
        jobHeader.appendChild(jobTitleDiv);
        jobHeader.appendChild(durationDiv);

        return jobHeader;
    }

    private createJobDuration(workExp: WorkExperience): HTMLDivElement {
        const durationDiv: HTMLDivElement = this.createElement('div') as HTMLDivElement;
        durationDiv.innerHTML = workExp.duration?.toString() || '';
        durationDiv.style.fontSize = '13px';
        durationDiv.style.wordBreak = 'break-word';

        return durationDiv;
    }

    private createJobTitle(workExp: WorkExperience): HTMLDivElement {
        const jobTitleDiv: HTMLDivElement = this.createElement('div') as HTMLDivElement;
        jobTitleDiv.innerHTML = workExp.jobTitle?.toString() || '';
        jobTitleDiv.style.fontSize = '13px';
        jobTitleDiv.style.wordBreak = 'break-word';

        return jobTitleDiv;
    }

    private createSectionHeader(title: string): HTMLDivElement {
        const workExpHeaderDiv: HTMLDivElement = this.createElement('div') as HTMLDivElement;
        workExpHeaderDiv.innerHTML = title || '';
        workExpHeaderDiv.style.fontSize = '24px';
        workExpHeaderDiv.style.wordBreak = 'break-word';
        workExpHeaderDiv.style.marginBottom = '10px';
        workExpHeaderDiv.className = 'gr-section-header';

        return workExpHeaderDiv;
    }

    private createElement(tagName: string): HTMLElement {
        return document.createElement(tagName);
    }
}
