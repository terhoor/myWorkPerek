import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { CardComponent } from './shared/components/card/card.component';
import { InfoPageComponent } from './info-page/info-page.component';
import { AppRoutingModule } from './app-routing.module';
import { BtnNextComponent } from './shared/components/buttons/btn-next/btn-next.component';
import { BtnBackComponent } from './shared/components/buttons/btn-back/btn-back.component';
import { MaterialModule } from './material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ConsentPageComponent } from './consent-page/consent-page.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PhoneMaskDirective } from './shared/directives/phone-mask.directive';
import { CodeAccessPageComponent } from './code-access-page/code-access-page.component';
import { OtherDataService } from './shared/services/other-data.service';
import { HttpClientModule } from '@angular/common/http';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { MatNativeDateModule } from '@angular/material';
import { RegistrationAccessPageComponent } from './registration-access-page/registration-access-page.component';
import { PopupInfoComponent } from './shared/components/popup/popup-info/popup-info.component';
import { PopupWarningComponent } from './shared/components/popup/popup-warning/popup-warning.component';



@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    CardComponent,
    InfoPageComponent,
    BtnNextComponent,
    BtnBackComponent,
    ConsentPageComponent,
    PhoneMaskDirective,
    CodeAccessPageComponent,
    RegistrationPageComponent,
    RegistrationAccessPageComponent,
    PopupInfoComponent,
    PopupWarningComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
  ],
  exports: [
    PhoneMaskDirective,
  ],
  entryComponents: [
    PopupInfoComponent,
    PopupWarningComponent,
  ],
  providers: [OtherDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
