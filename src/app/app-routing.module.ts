import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { InfoComponent } from './info/info.component';
import { ConsentPageComponent } from './consent-page/consent-page.component';
import { CodeAccessPageComponent } from './code-access-page/code-access-page.component';

const appRoutes: Routes = [
  {path: '', component: MainLayoutComponent, children: [
    {path: '', redirectTo: '/info', pathMatch: 'full'},
    {path: 'info', component: InfoComponent},
    {path: 'consent', component: ConsentPageComponent},
    {path: 'code', component: CodeAccessPageComponent},
  ]},
  {path: '**', redirectTo: '/info'}

];



@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
