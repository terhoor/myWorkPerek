import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { post } from 'selenium-webdriver/http';
import { MatDialog } from '@angular/material';
import { PopupInfoComponent } from '../components/popup/popup-info/popup-info.component';
import { PopupWarningComponent } from '../components/popup/popup-warning/popup-warning.component';

@Injectable()
export class OtherDataService {
  // phoneNumber: BehaviorSubject<string> = new BehaviorSubject('');
  accessForMerge: BehaviorSubject<boolean> = new BehaviorSubject(false);
  numberCard: BehaviorSubject<string> = new BehaviorSubject('0000000000000000');

  constructor(
    public dialog: MatDialog
  ) {
  }

  changeNumberDecoration(numberStr): string {
    if (numberStr.charAt(0) === '+') {
      return numberStr.replace(/^(\+\d)(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/, '$1 ($2) $3-$4-$5');
    } else {
      return numberStr.replace(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/, '($1) $2-$3-$4');
    }
  }

  changeNumberClear(numberStr): string {
    let result: string = '';
    if (numberStr.charAt(0) === '+') {
      result = numberStr.replace(/\D/g, '')
    } else {
      result = '+7' + numberStr.replace(/\D/g, '');
    }
    return result;
  }

  generateNumberCard() {
    const arrCard = [];
    for (let i = 0; i < 4; i++) {
      arrCard[i] = String(Math.floor(Math.random() * 9999) + 1000);
    }
    this.numberCard.next(arrCard.join(''));
  }

  saveInLocalStorage(step, dataObj): void {
    const strData = JSON.stringify(dataObj);
    localStorage.setItem(step, strData);
  }

  takeInLocalStorage(step): any {
    return JSON.parse(localStorage.getItem(step));
  }

  checkChar(event: KeyboardEvent): void {
    const numberKey = Number(String.fromCharCode(event.keyCode));
    if (isNaN(numberKey)) {
      event.preventDefault();
    }
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

  openDialogWarning(): void {
    const dialogRefWarning = this.dialog.open(PopupWarningComponent, {
      width: '100vw',
      maxWidth: '100vw',
      position: {
        top: 'auto'
      }
    });
  
    dialogRefWarning.afterClosed().subscribe(answer => {
      answer = !!answer;
      this.accessForMerge.next(answer);
      console.log(this.accessForMerge.getValue());
    });
  }
}
