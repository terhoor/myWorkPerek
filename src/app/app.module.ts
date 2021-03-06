import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { CardComponent } from './shared/components/card/card.component';
import { InfoPageComponent } from './info-page/info-page.component';
import { AppRoutingModule } from './app-routing.module';
import { BtnNextComponent } from './shared/components/buttons/btn-next/btn-next.component';
import { BtnBackComponent } from './shared/components/buttons/btn-back/btn-back.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ConsentPageComponent } from './consent-page/consent-page.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PhoneMaskDirective } from './shared/directives/phone-mask.directive';
import { CodeAccessPageComponent } from './code-access-page/code-access-page.component';
import { OtherDataService } from './shared/services/other-data.service';
import { HttpClientModule } from '@angular/common/http';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { MatNativeDateModule } from '@angular/material';
import { RegistrationSuccessPageComponent } from './registration-success-page/registration-success-page.component';
import { PopupInfoComponent } from './shared/components/popup/popup-info/popup-info.component';
import { PopupWarningComponent } from './shared/components/popup/popup-warning/popup-warning.component';
import { MapDisplayCardPipe } from './shared/components/pipes/map-display-card.pipe';
import { ApiService } from './shared/services/api.service';
import { TextMaskModule } from 'angular2-text-mask';


import {MatButtonModule, MatCheckboxModule, MatDatepickerModule} from '@angular/material';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import { TimerComponent } from './code-access-page/timer/timer.component';
import { LocaleStorageService } from './shared/services/locale-storage.service';

const materialArray = [
  MatButtonModule,
  MatInputModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule
];

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
    RegistrationSuccessPageComponent,
    PopupInfoComponent,
    PopupWarningComponent,
    MapDisplayCardPipe,
    TimerComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    materialArray,
    TextMaskModule
  ],
  exports: [
    PhoneMaskDirective,
  ],
  entryComponents: [
    PopupInfoComponent,
    PopupWarningComponent,
  ],
  providers: [
    OtherDataService,
    ApiService,
    LocaleStorageService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
