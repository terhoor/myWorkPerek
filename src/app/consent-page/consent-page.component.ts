import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OtherDataService } from '../shared/services/other-data.service';

@Component({
  selector: 'app-consent-page',
  templateUrl: './consent-page.component.html',
  styleUrls: ['./consent-page.component.css']
})
export class ConsentPageComponent implements OnInit {


  isValidForm: boolean = false;
  consent: FormGroup;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private otherDataService: OtherDataService
  ) { }

  ngOnInit() {
    let lastNumber = this.otherDataService.phoneNumber.getValue();
    if (lastNumber !== '') {
      lastNumber = this.otherDataService.changeNumberDecore(lastNumber.slice(2));

    }
    this.consent = this.fb.group({
      phone: [lastNumber, [
        Validators.required,
        Validators.minLength(15),
        Validators.maxLength(15)
      ]],
      checkbox1: ['', [Validators.required]],
      checkbox2: ['', [Validators.required]]
    });

    this.onChanges();


  }

  onChanges() {
    const form = this.consent;
    this.consent.valueChanges.subscribe(() => {
      // if (this.consent.controls['phone'].value.length > 15) {
      //   this.consent.patchValue({
      //     'phone': this.consent.controls['phone'].value.slice(0, 15)
      //   });
      // }
      this.isValidForm = form.valid && form.controls['checkbox1'].value === true && form.controls['checkbox2'].value === true;
    });
  }

  onSubmit() {
    if (this.isValidForm) {
      const clearNumber = '+7' + this.consent.controls['phone'].value.replace(/\D/g, '');

      if (!true) {
        this.openDialogWarning();
      } else {
        this.otherDataService.phoneNumber.next(clearNumber);
        this.router.navigate(['/code']);

      }

    }
  }


  openDialog(strInfo): void {
    this.otherDataService.openDialog(strInfo);
  }
  openDialogWarning(): void {
    this.otherDataService.openDialogWarning();
  }
}
