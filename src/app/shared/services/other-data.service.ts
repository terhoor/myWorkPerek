import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { post } from 'selenium-webdriver/http';
import { MatDialog } from '@angular/material';
import { PopupInfoComponent } from '../components/popup/popup-info/popup-info.component';

@Injectable()
export class OtherDataService {
  phoneNumber: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private httpService: HttpClient,
    public dialog: MatDialog
    ) {

  }


  changeNumberDecore(numberStr) {
    if (numberStr.length === 12) {
      return numberStr.replace(/^(\+\d)(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/, '$1 ($2) $3-$4-$5');
    } else if (numberStr.length === 10) {
      return numberStr.replace(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/, '($1) $2-$3-$4');
    }
  }

  // при настройке api изменить с все api

  getCheckCode(): Observable<Object> {
    return this.httpService.get('../assets/code.json');

  }

  


  openDialog(strInfo): void {
    this.dialog.open(PopupInfoComponent, {
      width: '100vw',
      height: '100vh',
      maxHeight: '100vh',
      maxWidth: '100vw',

      data: strInfo
    });

  }

}
