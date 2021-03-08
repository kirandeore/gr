import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResumeBuilderRoutingModule } from './resume-builder-routing.module';
import { ResumeBuilderComponent } from './resume-builder.component';
import { PageComponent } from './page/page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { TextAreaComponent } from './text-area/text-area.component';
import { TextBoxComponent } from './text-box/text-box.component';
import { ResumeFillupFormComponent } from './resume-fillup-form/resume-fillup-form.component';

@NgModule({
    declarations: [ResumeBuilderComponent, PageComponent, TextAreaComponent, TextBoxComponent, ResumeFillupFormComponent],
    imports: [
        CommonModule,
        ResumeBuilderRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        QuillModule.forRoot({
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ 'align': [] }]
                ],
            },
        }),
    ],
})
export class ResumeBuilderModule {}
