import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { OtherDataService } from '../shared/services/other-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../shared/services/api.service';
import { Steps } from '../shared/steps';
import { takeUntil, tap, debounceTime, catchError } from 'rxjs/operators';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { LSDataStep2 } from '../shared/interfaces/steps-models';
import { LocaleStorageService } from '../shared/services/locale-storage.service';

@Component({
  selector: 'app-code-access-page',
  templateUrl: './code-access-page.component.html',
  styleUrls: ['./code-access-page.component.css']
})
export class CodeAccessPageComponent implements OnInit, OnDestroy {

  attempt: number = this.apiService.repeatCount;
  timer$: BehaviorSubject<number>;
  phoneNumber: string;
  nextAccess: boolean = false;
  formCode: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  localData: LSDataStep2;

  constructor(
    private fb: FormBuilder,
    private otherDataService: OtherDataService,
    private router: Router,
    private apiService: ApiService,
    private localeStorageService: LocaleStorageService
  ) { }

  ngOnInit() {
    this.localData = this.localeStorageService.takeInLocalStorage(Steps.step2) || {};
    this.formCode = this.fb.group({
      code: [this.localData.code,
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });

    if (this.localData.code) {
    this.switchOnBtnNext();
    }

    this.phoneNumber = this.otherDataService.changeNumberDecoration(this.apiService.phone);

    this.formCode.controls['code'].valueChanges
      .pipe(
        debounceTime(200),
        takeUntil(this.destroy$)
        )
      .subscribe(() => {
        this.saveLocalStorage();
        this.switchOnBtnNext();
      });

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  saveLocalStorage(): void {
    // this.localData['code'] = this.formCode.value;
    const newData = Object.assign(this.localData, this.formCode.value);
    this.localeStorageService.saveInLocalStorage(Steps.step2, newData);
  }

  switchOnBtnNext(): void {
    this.nextAccess = true;
  }

  switchOffBtnNext(): void {
    this.nextAccess = false;
  }

  doAttempt(): void {
    this.switchOffBtnNext();
    if (this.attempt > 0) {
      this.attempt--;
    }

    if (this.attempt === 0) {
      this.formCode.disable();
    }
  }

  requestNewCode(): void {
    this.switchOffBtnNext();
    this.repeatSentCode();
  }

  repeatSentCode(): void {
    this.apiService.checkPhone(this.apiService.phone)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  checkChar(event: KeyboardEvent): void {
    this.otherDataService.checkChar(event);
  }

  checkCode(): void {
    const stateValid = this.formCode.valid;
    this.formCode.disable();
    const valueFormCode = this.formCode.value.code;
    if (!stateValid) {
      this.switchOffBtnNext();
      this.formCode.enable();
      return;
    }
    this.apiService.checkCode(valueFormCode)
    .pipe(
      takeUntil(this.destroy$),
      catchError((error) => {
        return of(error);
      })
    )
    .subscribe((res: any) => {
      console.log('answer', res);
      if (res.success) {
        this.otherDataService.generateNumberCard();
        this.router.navigate(['/registration']);
      } else {
        this.formCode.enable();
        this.doAttempt();
        this.formCode.controls['code'].setErrors({ 'incorrecast': true });
      }
    });
  }

}
