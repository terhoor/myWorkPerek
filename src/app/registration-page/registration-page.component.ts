import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../shared/services/api.service';
import { debounceTime, tap, catchError } from 'rxjs/operators';
import { Steps } from '../shared/steps';
import { of } from 'rxjs';
import { LocaleStorageService } from '../shared/services/locale-storage.service';
import { LSDataStep3 } from '../shared/interfaces/steps-models';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit {

  formReg: FormGroup;
  errorTime: string = 'signup-8-token-missing';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private localeStorageService: LocaleStorageService,
  ) {

  }

  ngOnInit() {
    const localData: LSDataStep3 = this.localeStorageService.takeInLocalStorage(Steps.step3) || {};

    this.formReg = this.fb.group({
      firstName: [localData['firstName'], [Validators.required]],
      lastName: [localData['lastName'], [Validators.required]],
      birthday: [localData['birthday'], [Validators.required]],
      email: [localData['email'], [Validators.required, Validators.email]]

    });

    this.formReg.valueChanges.pipe(
      debounceTime(1000),
      tap(() => {
        this.localeStorageService.saveInLocalStorage(Steps.step3, this.formReg.value);
      }))
      .subscribe();

  }

  regUser(): void {
    const valueUser = this.formReg.value;
    const dateUser = valueUser.birthday;
    this.formReg.disable();
    if (typeof dateUser === 'object') {
      valueUser.birthday = this.setBirthDay(dateUser);
    }

    this.apiService.registerUser(valueUser)
      .pipe(
        catchError((error) => {
          return of(error);
        })
      )
      .subscribe((res: any) => {
        this.regUserResProcessing(res);
      });
  }

  setBirthDay(dateUser: any): string {
    const year = this.addZero(dateUser.getFullYear());
    const month = this.addZero(dateUser.getMonth());
    const day = this.addZero(dateUser.getDate());
    return `${year}.${month}.${day}`;
  }

  regUserResProcessing(res: any) {
    if (res.accessToken && res.refreshToken) {
      this.router.navigate(['/register-success']);
    } else if (this.errorTime === res.error.code) {
      this.router.navigate(['/consent'], {
        queryParams: {
          warningTime: true
        }
      });
    } else {
      this.formReg.enable();
      console.log('Ошибка!!!');
    }
  }

  addZero(num: number): string {
    if (num < 10) {
      return '0' + num;
    }
    return num.toString();
  }

}
