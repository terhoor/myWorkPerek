import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { InfoComponent } from './info/info.component';
import { ConsentPageComponent } from './consent-page/consent-page.component';

const appRoutes: Routes = [
  {path: '', component: MainLayoutComponent, children: [
    {path: '', redirectTo: '/info', pathMatch: 'full'},
    {path: 'info', component: InfoComponent},
    {path: 'consent', component: ConsentPageComponent},
  ]},
  {path: '**', redirectTo: '/404'}

];



@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
