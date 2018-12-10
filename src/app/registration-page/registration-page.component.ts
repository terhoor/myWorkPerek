import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
    private router: Router
    ) {

   }

  ngOnInit() {
    this.formReg = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]

    });

    this.formReg.statusChanges.subscribe(() => {
      this.nextAccess = this.formReg.valid;
    })

  }

  regUser() {
    this.router.navigate(['/register-success']);
  }

}
