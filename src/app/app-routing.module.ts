import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [{
    path: "resume-builder",
    loadChildren: () => import("./resume-builder/resume-builder.module")
    .then((m) => m.ResumeBuilderModule) }];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
