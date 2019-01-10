import { Component, OnInit, OnChanges, DoCheck, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OtherDataService } from '../shared/services/other-data.service';
import { ApiService } from '../shared/services/api.service';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, debounceTime, tap } from 'rxjs/operators';
import { Steps } from '../shared/steps';
import { LocaleStorageService } from '../shared/services/locale-storage.service';
import { LSDataStep1 } from '../shared/interfaces/steps-models';

@Component({
  selector: 'app-consent-page',
  templateUrl: './consent-page.component.html',
  styleUrls: ['./consent-page.component.css']
})
export class ConsentPageComponent implements OnInit, OnDestroy {
  lengthNumber = 12;
  consent: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();

  public phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private otherDataService: OtherDataService,
    private apiService: ApiService,
    private localeStorageService: LocaleStorageService,
  ) { }

  ngOnInit() {
    const localData: LSDataStep1 = this.localeStorageService.takeInLocalStorage(Steps.step1) || {};
    this.apiService.generateInstanceId((Math.random() * 20).toString());
    this.apiService.signInDevice().subscribe(data => {
    });

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
        this.localeStorageService.saveInLocalStorage(Steps.step1, this.consent.value);
      }))
      .subscribe();

    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((items: any) => {
        const warningTime = items['warningTime'];
        if (warningTime) {
          console.log('превышен лимит ожидания');
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit(): void {
    const stateValid = this.consent.valid;
    this.consent.disable();
    const resultCheck = this.submitCheckValid();

    if (stateValid && resultCheck) {
      this.submitStateValid(resultCheck);
    }
  }

  submitCheckValid(): string {
    const phone = this.consent.controls['phone'].value;
    const clearNumber = this.otherDataService.changeNumberClear(phone);
    if (clearNumber.length !== this.lengthNumber) {
      this.consent.enable();
      this.consent.controls['phone'].setErrors({ 'incorrect': true });
      return '';
    }
    return clearNumber;
  }

  submitStateValid(clearNumber: string): void {
    let nextStep: boolean;
    this.apiService.checkPhone(clearNumber)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(dataInfo => {
        nextStep = !!dataInfo.token;
        if (nextStep) {
          this.router.navigate(['/code']);
        }
      });
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

  openDialogWarning(): void {
    this.otherDataService.openDialogWarning();
  }

}
