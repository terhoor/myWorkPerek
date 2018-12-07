import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class OtherDataService {
  phoneNumber: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private httpService: HttpClient) {

  }

  getCode() {
    return this.httpService.get('../assets/code.json');
  }
}