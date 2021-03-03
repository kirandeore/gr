import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResumeBuilderRoutingModule } from './resume-builder-routing.module';
import { ResumeBuilderComponent } from './resume-builder.component';
import { PageComponent } from './page/page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { TextAreaComponent } from './text-area/text-area.component';
import { TextBoxComponent } from './text-box/text-box.component';

@NgModule({
    declarations: [ResumeBuilderComponent, PageComponent, TextAreaComponent, TextBoxComponent],
    imports: [CommonModule, ResumeBuilderRoutingModule, FormsModule, ReactiveFormsModule, QuillModule.forRoot()],
})
export class ResumeBuilderModule {}
