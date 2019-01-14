import { Component, OnInit, OnChanges, DoCheck, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OtherDataService } from '../shared/services/other-data.service';
import { ApiService } from '../shared/services/api.service';
import { fromEvent, Subject, of } from 'rxjs';
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
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public consent: FormGroup;
  private clearPhone: string = '';
  public phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private otherDataService: OtherDataService,
    private apiService: ApiService,
    private localeStorageService: LocaleStorageService,
  ) { }

  validatorLength(control: AbstractControl) {
    const needLength = this.apiService.getLengthPhone();
    const clearPhone = this.otherDataService.changeNumberClear(control.value);
    const lengthPhone = clearPhone.length;
    if (lengthPhone === needLength) {
      this.clearPhone = clearPhone;
      return of(null);
    }
    return of({'phoneError': true});
  }

  ngOnInit() {
    const localData: LSDataStep1 = this.localeStorageService.takeInLocalStorage(Steps.step1) || {};
    this.apiService.generateInstanceId((Math.random() * 20).toString());
    this.apiService.signInDevice().subscribe(_ => {
    });

    this.consent = this.fb.group({
      phone: [localData['phone'], [
        Validators.required,
      ], this.validatorLength.bind(this)],
      checkbox1: [localData['checkbox1'] || false, [Validators.pattern('true')]],
      checkbox2: [localData['checkbox2'] || false, [Validators.pattern('true')]]
    });

    this.consent.valueChanges.pipe(
      takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.localeStorageService.saveInLocalStorage(Steps.step1, this.consent.value);
      });

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
    let nextStep: boolean;
    this.apiService.checkPhone(this.clearPhone)
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
