import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { InfoPageComponent } from './info-page/info-page.component';
import { ConsentPageComponent } from './consent-page/consent-page.component';
import { CodeAccessPageComponent } from './code-access-page/code-access-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { RegistrationAccessPageComponent } from './registration-access-page/registration-access-page.component';
import { AccessGuard } from './shared/classes/access.guard';

const appRoutes: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
    {
      path: '',
      redirectTo: '/info',
      pathMatch: 'full'
    },
    {
      path: 'info',
      component: InfoPageComponent
    },
    {
      path: 'consent',
      component: ConsentPageComponent
    },
    {
      path: 'code',
      component: CodeAccessPageComponent,
      canActivate: [AccessGuard]
    },
    {
      path: 'registration',
      component: RegistrationPageComponent,
      canActivate: [AccessGuard]
    },
    {
      path: 'register-success',
      component: RegistrationAccessPageComponent,
      canActivate: [AccessGuard]
    },
  ]},
  {path: '**', redirectTo: '/info'}

];



@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
