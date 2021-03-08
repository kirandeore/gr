import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ResumeBuilderFormService } from './services/resume-builder-form.service';

@Component({
    selector: 'app-resume-builder',
    templateUrl: './resume-builder.component.html',
    styleUrls: ['./resume-builder.component.scss'],
})
export class ResumeBuilderComponent implements OnInit {
    parentForm: FormGroup;
    testString = '';

    constructor(public formService: ResumeBuilderFormService) {
        this.parentForm = this.formService.getParentForm();
    }

    ngOnInit(): void {
        this.testString += '<ul>';

        for (let i = 0; i < 98; i++) {
            this.testString +=
                '<li>Develop and execute Unit Tests and develop detailed software designs from requirements, working with other team members</li><li>Analyze and fix performance problems on the application</li><li>Participate in code reviews: verify maintainability, extensibility and assure complexity has been minimized</li>';
        }

        this.testString += '</ul>';
        // console.log('::::test String is ready', this.testString);
    }

    testWasClicked() {
        // this.parentForm.get('')

        const workExps = this.parentForm.get('workExpParentForm')?.get('workExps') as FormArray;

        if (workExps?.get('0')) {
            // window['myControl'] = workExps.get('0').get('description');
            workExps.get('0').patchValue({ description: this.testString });
        }
    }
}
