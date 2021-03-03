import { FormArray, FormGroup } from '@angular/forms';
import { Form2HtmlService } from './services/form-2-html.service';
import { ResumeBuilderFormService } from './services/resume-builder-form.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-resume-builder',
    templateUrl: './resume-builder.component.html',
    styleUrls: ['./resume-builder.component.scss'],
})
export class ResumeBuilderComponent implements OnInit {
    parentForm: FormGroup;
    workExps: FormArray;
    credentials: FormArray;

    constructor(public formService: ResumeBuilderFormService, public form2HtmlService: Form2HtmlService) {
        window['mypage'] = this;
        this.populateForm();
    }

    ngOnInit(): void {}

    private populateForm(): void {
        this.parentForm = this.formService.getParentForm();

        this.workExps = this.parentForm.get('workExpParentForm')?.get('workExps') as FormArray;
        this.credentials = this.parentForm.get('eduParentForm')?.get('credentials') as FormArray;
        this.formService.addNewEducation();
        this.formService.addNewWorkExperience();
    }
}
