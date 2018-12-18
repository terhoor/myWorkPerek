import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

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
  repeatCount = 10; // count repeat
  userAccessToken: string; // user access token
  userRefreshToken: string; // user refresh token
  registerToken: string;
  user: any;

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

  constructor(private httpClient: HttpClient) {
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
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if (error.error.code === '2fa-02') {
          this._userExists = false;
          return this.httpClient.post(this.getUrl('/api/v5/signup/new/step1'), {
            'number': this._phone,
            'ackMergeActiveCards': false
          }, httpOptions
          ).pipe(
            tap((response: any) => {
              this.codeToken = response.token;
              this.repeatTime = 30;
              this.repeatCount = 10;
            })
          );
        }
        return throwError(error);
      })
    );
  }

  public checkCode(code: string): Observable<any> {
    let codeObserver: Observable<any>;
    const httpOptions = { headers: this.getHeaders(new HttpHeaders({ 'X-Authorization': 'Bearer ' + this.deviceAccessToken })) };
    if (this._userExists) {
      console.log('if');
      codeObserver = this.httpClient.post(this.getUrl('/api/v5/auth/signin'), {
        'grantType': 'IDENTITY_TOKEN',
        'instanceId': this._instanceId,
        'two_factor': {
          'token': this.codeToken,
          'code': code
        }
      }, httpOptions).pipe(tap((result: any) => {
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

    return codeObserver.pipe(
      map((response: any) => {
        return { success: true };
      }),
      catchError((error: any) => {
        return of({ success: false, message: error.message });
      })
    );
  }

  public registerUser(userData: { firstName: string, lastName: string, birthday: string, email: string }) {

    const httpOptions = { headers: this.getHeaders(new HttpHeaders({ 'X-Authorization': 'Bearer ' + this.deviceAccessToken })) };
    const data = Object.assign({ token: this.registerToken }, userData);
    return this.httpClient.post(this.getUrl('/api/v5/signup/new/step3'), data, httpOptions).pipe(tap((result: any) => {
      this.userAccessToken = result.accessToken;
      this.userRefreshToken = result.refreshToken;
    }));
  }

  // public getUser(): Observable<any> {
  //   const httpOptions = { headers: this.getHeaders(new HttpHeaders({ 'X-Authorization': 'Bearer ' + this.userAccessToken })) };
  //   return this.httpClient.get(this.getUrl('/api/v5/users/me'), httpOptions).pipe(tap((result: any) => this.user = result));
  // }

  // public sendCard() {
  //   const httpOptions = {
  //     headers: this.getHeaders(new HttpHeaders(
  //       {
  //         'Content-Type': 'application/json', 'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJzdWIiOlsicGVyZWtyZXN0b2siLCJhcGkiLCJtZXJjaGFudHMiXSwiZXhwIjoxNTcxODQwODU3LCJuYmYiOjE1NDAzMDQ4Mzd9.pkX32Bch09lAjDNwL9171j8I7uWB6SzhwBxMlOOLY1GvJenvyFAxQkyyyTjXt68qCAEjz_kNe_XdC1fvLHYqpiRjbClkDW-2A0YIath78e32BlocOeFfpNlSiN4nmH4JQ3rsh6xlr2R1dgrGS_LCOZUJNxckH4fwclpDHmYFmp-WiEm50_6drR4PjQJ3BqE_PWXd1t4WTUEGkHB5-3sa6xxQC3LShBq9ALO2NXJ7mvsQ2R0ELbYjjyLLLkvATaUWo4_UbOK6JHjznrMRzyVT0JDKEqHrA-sIKXZZDsuLnsEGY2Khjn78aqaq3va7qr-TJfJT7oV4PXn8R0VC2THNZQ`
  //       }
  //     ))
  //   };
  //   return this.httpClient.post('https://lc.edadev.ru/api/v1/cards/perekrestok/callback', {
  //     'cardno': this.user.loyaltyNo,
  //     'uid': this.edadilId,
  //     'duid': this.deviceId,
  //     'created_at': (new Date()).toISOString()
  //   }, httpOptions);
  // }

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
          return of({ title: 'Соглашение на обработку персональных данных', text: 'Не получилось загрузить соглашение. Попробуйте позже.' });
        })
      );
  }

  public generateInstanceId(deviceId: string) {
    this._instanceId = <string>(new Md5).appendStr(deviceId).end();
  }

  private getUrl(path: string) {
    return this.baseUri + path;
  }

  private getHeaders(headers: HttpHeaders) {
    return headers
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Basic ' + btoa('edadil:kLUWMyyNKNs7VtyH'));
  }

  public setPhone(phone: string) {
    this._phone = phone;
  }

  // get cardNumber(): any {
  //   return this.user.loyaltyNo === undefined ? false : this.user.loyaltyNo;
  // }
}
