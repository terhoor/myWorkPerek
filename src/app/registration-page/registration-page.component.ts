import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit {

  nextAccess: boolean;
  formReg: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService
  ) {

  }

  ngOnInit() {
    this.formReg = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]

    });

    this.formReg.statusChanges.subscribe(() => {
      this.nextAccess = this.formReg.valid;
    });

  }

  regUser() {

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
