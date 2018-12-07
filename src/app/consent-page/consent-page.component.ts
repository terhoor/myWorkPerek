import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OtherDataService } from '../shared/services/other-data.service';

@Component({
  selector: 'app-consent-page',
  templateUrl: './consent-page.component.html',
  styleUrls: ['./consent-page.component.css']
})
export class ConsentPageComponent implements OnInit {


  isValidForm: boolean = false;
  consent = this.fb.group({
    phone: ['', [ Validators.required, Validators.minLength(16)]],
    checkbox1: ['', [Validators.required]],
    checkbox2: ['', [Validators.required]]
  });


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private otherDataService: OtherDataService
    ) { }

  ngOnInit() {

    this.onChanges();
   }

   onChanges() {
    const form = this.consent;
    this.consent.valueChanges.subscribe(() => {
      this.isValidForm = form.valid && form.controls['checkbox1'].value === true && form.controls['checkbox2'].value === true;
    });
  }

  onSubmit() {
    if (this.isValidForm) {
      const clearNumber = '+7' + this.consent.controls['phone'].value.replace(/\D/g, '');
      this.otherDataService.phoneNumber.next(clearNumber);
      this.router.navigate(['/code']);
    }
  }
}
