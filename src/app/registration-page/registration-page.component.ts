import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../shared/services/api.service';
import { debounceTime, tap } from 'rxjs/operators';
import { OtherDataService } from '../shared/services/other-data.service';
import { Steps } from '../shared/steps';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit {

  formReg: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private otherDataService: OtherDataService
  ) {

  }

  ngOnInit() {
    const localData = this.otherDataService.takeInLocalStorage(Steps.step3) || {};

    this.formReg = this.fb.group({
      firstName: [localData['firstName'], [Validators.required]],
      lastName: [localData['lastName'], [Validators.required]],
      birthday: [localData['birthday'], [Validators.required]],
      email: [localData['email'], [Validators.required, Validators.email]]

    });

    this.formReg.valueChanges.pipe(
      debounceTime(1000),
      tap(() => {
        this.otherDataService.saveInLocalStorage(Steps.step3, this.formReg.value);
      }))
      .subscribe();

  }

  regUser(): void {

    const valueUser = this.formReg.value;
    const dateUser = valueUser.birthday;
    if (typeof dateUser === 'object') {
      const year = this.addZero(dateUser.getFullYear());
      const month = this.addZero(dateUser.getMonth());
      const day = this.addZero(dateUser.getDate());

      valueUser.birthday = `${year}.${month}.${day}`;
    }

    this.apiService.registerUser(valueUser).subscribe(dataTokens => {
      if (dataTokens.accessToken && dataTokens.refreshToken) {
        this.router.navigate(['/register-success'], {
          queryParams: {
            access: true
          }
        });
      } else {
        console.log('error');
      }
    });
  }

  addZero(num: number): string {
    if (num < 10) {
      return '0' + num;
    }
    return num.toString();
  }

}
