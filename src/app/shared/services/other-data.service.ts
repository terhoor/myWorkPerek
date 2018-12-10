import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class OtherDataService {
  phoneNumber: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private httpService: HttpClient) {

  }

  getCode() {
    return this.httpService.get('../assets/code.json');
  }

  changeNumberDecore(numberStr) {
    if (numberStr.length === 12) {
    return numberStr.replace(/^(\+\d)(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/, '$1 ($2) $3-$4-$5');
  } else if (numberStr.length === 10) {
    return numberStr.replace(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/, '($1) $2-$3-$4');

  }
 
}