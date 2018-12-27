import { Component, OnInit, OnChanges, DoCheck, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OtherDataService } from '../shared/services/other-data.service';
import { ApiService } from '../shared/services/api.service';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, debounceTime, tap} from 'rxjs/operators';
import { Steps } from '../shared/steps';

@Component({
  selector: 'app-consent-page',
  templateUrl: './consent-page.component.html',
  styleUrls: ['./consent-page.component.css']
})
export class ConsentPageComponent implements OnInit, OnDestroy {

  consent: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();

  public phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private otherDataService: OtherDataService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    const localData = this.otherDataService.takeInLocalStorage(Steps.step1) || {};

    this.consent = this.fb.group({
      phone: [localData['phone'], [
        Validators.required
      ]],
      checkbox1: [localData['checkbox1'] || false, [Validators.pattern('true')]],
      checkbox2: [localData['checkbox2'] || false, [Validators.pattern('true')]]
    });

    this.consent.valueChanges.pipe(
      debounceTime(1000),
      takeUntil(this.destroy$),
      tap(() => {
        this.otherDataService.saveInLocalStorage(Steps.step1, this.consent.value);
      }))
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit(): void {
    const phone = this.consent.controls['phone'].value;
    const clearNumber = this.otherDataService.changeNumberClear(phone);
    if (clearNumber.length !== 12) {
      this.consent.controls['phone'].setErrors({'incorrect': true});
      return;
    }
    let nextStep: boolean;
    if (this.consent.valid) {
      this.apiService.checkPhone(clearNumber)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(dataInfo => {
        nextStep = !!dataInfo.token;
        if (nextStep && !dataInfo.hasActiveCards) {
          this.router.navigate(['/code'], {
            queryParams: {
              access: true
            }
          });
        }
      });
    }
  }


  openDialogWarning(): void {
    this.otherDataService.openDialogWarning();
  }

  showPopupRule(): void {
    this.apiService.getRules().subscribe(rule => {
      this.otherDataService.openDialog(rule);
    });
  }

  showAgreement(): void {
    this.apiService.getAgreement().subscribe(agreement => {
      this.otherDataService.openDialog(agreement);
    });
  }

}
