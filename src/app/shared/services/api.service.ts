import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Steps } from '../steps';
import { AccessNext } from '../interfaces/models';
import { LocaleStorageService } from './locale-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUri = 'https://dev.perekrestok.msoft.su'; // url по которому идет запрос
  private _instanceId: string; // Идентификатор инсталляции - 32 символа
  public edadilId: string;
  public deviceId: string;
  private _deviceAccessToken: string; // device access token
  private _deviceRefreshToken: string; // device refresh token
  private _phone: string; // phone number
  private _userExists = false; // флаг существования
  codeToken: string;
  repeatTime = 30; // time for repeat
  repeatCount = 5; // count repeat
  userAccessToken: string; // user access token
  userRefreshToken: string; // user refresh token
  registerToken: string;
  // user: any;
  errorCanIssue = '2fa-02';

  collectDataForApi(): {} {
    const data = {
      '_instanceId': this._instanceId,
      'edadilId': this.edadilId,
      'deviceId': this.deviceId,
      '_deviceAccessToken': this._deviceAccessToken,
      '_deviceRefreshToken': this._deviceRefreshToken,
      '_userExists': this._userExists,
      '_phone': this._phone,
      'codeToken': this.codeToken,
      'repeatTime': this.repeatTime,
      'repeatCount': this.repeatCount,
      'userAccessToken': this.userAccessToken,
      'userRefreshToken': this.userRefreshToken,
      'registerToken': this.registerToken,
    };
    return data;
  }

  saveDataInLocSt() {
    this.localeStorageService.saveInLocalStorage(Steps.dataSave, this.collectDataForApi());
  }

  getDataInLocSt() {
    const data = this.localeStorageService.takeInLocalStorage(Steps.dataSave) || null;
    if (data === null) {
      return;
    }
    const keys = Object.keys(data);
    keys.forEach((key) => {
      this[key] = data[key];
    });
  }

  get instanceId(): string {
    return this._instanceId;
  }

  get phone(): string {
    return this._phone;
  }

  get deviceAccessToken(): string {
    return this._deviceAccessToken;
  }

  get deviceRefreshToken(): string {
    return this._deviceRefreshToken;
  }

  get userExists(): boolean {
    return this._userExists;
  }

  constructor(
    private httpClient: HttpClient,
    private localeStorageService: LocaleStorageService
  ) {
    this.getDataInLocSt();
  }

  public signInDevice(): Observable<any> {
    const httpOptions = { headers: this.getHeaders(new HttpHeaders()) };
    return this.httpClient.post(this.getUrl('/api/v5/auth/signin'), {
      'grant_type': 'DEVICE_TOKEN',
      'instance_id': this.instanceId,
      'device': {
        'platform': 'WEB',
        'version': '1.0',
      }
    }, httpOptions)
      .pipe(
        tap((response: any) => {
          this._deviceAccessToken = response.accessToken;
          this._deviceRefreshToken = response.refreshToken;
        }),
        catchError(() => throwError('Invalid request'))
      );
  }

  public checkPhone(phone: string): Observable<any> {
    if (phone[0] === '+') {
      this._phone = phone;
    } else {
      this._phone = '+7' + phone;
    }
    const httpOptions = {
      headers: this.getHeaders(new HttpHeaders({
        'X-Authorization': 'Bearer ' + this.deviceAccessToken
      }))
    };
    return this.httpClient.post(this.getUrl('/api/v5/2fa/phone/requests'), {
      'number': this._phone,
    }, httpOptions).pipe(
      tap((response: any) => {
        console.log(response);
        this._userExists = true;
        this.codeToken = response.token;
        this.repeatTime = response.repeatAfter;
        this.repeatCount = response.repeatCount;
        this.saveDataInLocSt();

      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if (error.error.code === this.errorCanIssue) {
          this._userExists = false;
          return this.httpClient.post(this.getUrl('/api/v5/signup/new/step1'), {
            'number': this._phone,
            'ackMergeActiveCards': false
          }, httpOptions
          ).pipe(
            tap((response: any) => {
              this.codeToken = response.token;
              this.repeatTime = 30;
              this.repeatCount = 5;
              this.saveDataInLocSt();

            })
          );
        } else {
          console.log('Возникли проблемы');
        }
        return throwError(error);
      })
    );
  }

  public checkCode(code: string): Observable<any> {
    let codeObserver: Observable<any>;
    const httpOptions = {
      headers: this.getHeaders(new HttpHeaders({ 'X-Authorization': 'Bearer ' + this.deviceAccessToken }))
    };
    if (this._userExists) {
      console.log('if');
      codeObserver = this.httpClient.post(this.getUrl('/api/v5/auth/signin'), {
        'grantType': 'IDENTITY_TOKEN',
        'instanceId': this._instanceId,
        'two_factor': {
          'token': this.codeToken,
          'code': code
        }
      }, httpOptions).pipe(tap((result: AccessNext) => {
        this.userAccessToken = result.accessToken;
        this.userRefreshToken = result.refreshToken;
      }));
    } else {
      console.log('else');
      codeObserver = this.httpClient.post(this.getUrl('/api/v5/signup/new/step2'), {
        'token': this.codeToken,
        'code': code
      }, httpOptions).pipe(tap((result: any) => {
        this.registerToken = result.token;
      }));
    }
    this.saveDataInLocSt();

    return codeObserver.pipe(
      map((response: any) => {
        return { success: true };
      }),
      catchError((error: any) => {
        return of({ success: false, message: error.message });
      })
    );
  }

  public registerUser(userData: { firstName: string, lastName: string, birthday: string, email: string }): Observable<AccessNext> {

    const httpOptions = {
      headers: this.getHeaders(new HttpHeaders({ 'X-Authorization': 'Bearer ' + this.deviceAccessToken }))
    };
    const data = Object.assign({ token: this.registerToken }, userData);
    return this.httpClient.post(this.getUrl('/api/v5/signup/new/step3'), data, httpOptions).pipe(tap((result: any) => {
      this.userAccessToken = result.accessToken;
      this.userRefreshToken = result.refreshToken;
      this.saveDataInLocSt();

    }));
  }

  public getRules(): Observable<{ title: string, text: string }> {
    const httpOptions = { headers: this.getHeaders(new HttpHeaders({ 'X-Authorization': 'Bearer ' + this.deviceAccessToken })) };
    return this.httpClient.get(this.getUrl('/api/v3/legal-information/document/club-rules'), httpOptions)
      .pipe(
        map((response: any) => {
          return { title: response.title, text: response.text };
        }),
        catchError(() => {
          return of({ title: 'Правила клуба', text: 'Не получилось загрузить правила клуба. Попробуйте позже.' });
        })
      );
  }

  public getAgreement(): Observable<{ title: string, text: string }> {
    const httpOptions = { headers: this.getHeaders(new HttpHeaders({ 'X-Authorization': 'Bearer ' + this.deviceAccessToken })) };
    return this.httpClient.get(this.getUrl('/api/v3/legal-information/document/contract-offer'), httpOptions)
      .pipe(
        map((response: any) => {
          return { title: response.title, text: response.text };
        }),
        catchError(() => {
          return of({ title: 'Соглашение на обработку персональных данных',
          text: 'Не получилось загрузить соглашение. Попробуйте позже.' });
        })
      );
  }

  public generateInstanceId(deviceId: string) {
    this._instanceId = <string>(new Md5).appendStr(deviceId).end();
  }

  private getUrl(path: string) {
    return this.baseUri + path;
  }

  private getHeaders(headers: HttpHeaders): {} {
    return headers
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Basic ' + btoa('edadil:kLUWMyyNKNs7VtyH'));
  }

  public setPhone(phone: string): void {
    this._phone = phone;
  }

}
