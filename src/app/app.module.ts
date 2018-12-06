import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { CardComponent } from './shared/components/card/card.component';
import { InfoComponent } from './info/info.component';
import { AppRoutingModule } from './app-routing.module';
import { BtnNextComponent } from './shared/components/buttons/btn-next/btn-next.component';
import { BtnBackComponent } from './shared/components/buttons/btn-back/btn-back.component';
import { MaterialModule } from './material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ConsentPageComponent } from './consent-page/consent-page.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    CardComponent,
    InfoComponent,
    BtnNextComponent,
    BtnBackComponent,
    ConsentPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
