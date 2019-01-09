import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocaleStorageService {

  constructor() { }

  saveInLocalStorage(step, dataObj): void {
    const strData = JSON.stringify(dataObj);
    localStorage.setItem(step, strData);
  }

  takeInLocalStorage(step): any {
    return JSON.parse(localStorage.getItem(step));
  }
}
