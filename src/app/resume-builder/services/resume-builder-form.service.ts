import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Education, WorkExperience } from '../interfaces/resume-form-model';

@Injectable({
    providedIn: 'root',
})
export class ResumeBuilderFormService {
    private parentForm: FormGroup;
    private workExpParentForm: FormGroup;
    private eduParentForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.initEduParentForm();
        this.initWrkExpParentForm();
        this.initParentForm();
    }

    private initParentForm() {
        this.parentForm = this.fb.group({
            workExpParentForm: this.workExpParentForm,
            eduParentForm: this.eduParentForm,
        });
    }

    private initWrkExpParentForm() {
        this.workExpParentForm = this.fb.group({
            header: 'Work Experience',
            workExps: new FormArray([]),
        });
    }

    private initEduParentForm() {
        this.eduParentForm = this.fb.group({
            header: 'Education',
            credentials: new FormArray([]),
        });
    }

    addNewEducation() {
        const credentials: FormArray = this.eduParentForm.get('credentials') as FormArray;
        credentials.push(this.createEducationForm());
    }

    addNewWorkExperience() {
        const workExps: FormArray = this.workExpParentForm.get('workExps') as FormArray;
        workExps.push(this.createWorkExpForm());
    }

    getParentForm(): FormGroup {
        return this.parentForm;
    }

    private createEducationForm(): FormGroup {
        return this.fb.group(({
            degree: null,
            institution: null,
            duration: null,
            city: null,
            state: null,
            country: null,
        } as unknown) as Education);
    }

    private createWorkExpForm(): FormGroup {
        return this.fb.group({
            jobTitle: 'Senior Web Software Developer',
            duration: '11/2017 - present',
            company: 'QuinStreet',
            city: 'Foster City',
            state: 'CA',
            country: 'United States',
            description: ''
                // '<ul><li>Develop and execute Unit Tests and develop detailed software designs from requirements, working with other team members</li><li>Analyze and fix performance problems on the application</li><li>Participate in code reviews: verify maintainability, extensibility and assure complexity has been minimized</li></ul>',
        } as WorkExperience);
    }
}
