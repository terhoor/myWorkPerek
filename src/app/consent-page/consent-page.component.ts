import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OtherDataService } from '../shared/services/other-data.service';
import { ApiService } from '../shared/services/api.service';

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
    private otherDataService: OtherDataService,
    private apiService: ApiService
  ) { }

  ngOnInit() {

    this.consent = this.fb.group({
      phone: [this.apiService.phone, [
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
      this.isValidForm = form.valid && form.controls['checkbox1'].value === true && form.controls['checkbox2'].value === true;
    });
  }

  onSubmit() {
    const funcNextStep = clearNumber => {
      this.apiService.setPhone(clearNumber);
      this.router.navigate(['/code']);
    };
    let nextStep: boolean;
    if (this.isValidForm) {
      const phone = this.consent.controls['phone'].value;
      const clearNumber = '+7' + phone.replace(/\D/g, '');
      this.apiService.checkPhone(clearNumber).subscribe(dataInfo => {
        nextStep = !!dataInfo.token;
        if (nextStep && !dataInfo.hasActiveCards) {
          funcNextStep(clearNumber);
        } else if (!nextStep && dataInfo.hasActiveCards) {
          this.otherDataService.openDialogWarning();
          this.otherDataService.accessForMerge.subscribe(valueFlag => {
            if (valueFlag) {
              funcNextStep(clearNumber);
            }
          });
        }
      });
    }
  }


  openDialogWarning(): void {
    this.otherDataService.openDialogWarning();
  }

  showPopupRule() {
    this.apiService.getRules().subscribe(rule => {
      this.otherDataService.openDialog(rule);
    });
  }

  showAgreement() {
    this.apiService.getAgreement().subscribe(agreement => {
      this.otherDataService.openDialog(agreement);
    });
  }


}
