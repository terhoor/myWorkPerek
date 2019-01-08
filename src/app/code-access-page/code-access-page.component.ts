import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { OtherDataService } from '../shared/services/other-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../shared/services/api.service';
import { Steps } from '../shared/steps';
import { takeUntil, tap, debounceTime } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';

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

  constructor(
    private fb: FormBuilder,
    private otherDataService: OtherDataService,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    const localData = this.otherDataService.takeInLocalStorage(Steps.step2) || {};
    this.formCode = this.fb.group({
      code: [localData.code,
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });

    if (localData.code) {
    this.switchBtnNext(true);
    }

    this.timer$ = new BehaviorSubject(localData.timer !== undefined ? localData.timer : this.apiService.repeatTime);
    this.phoneNumber = this.otherDataService.changeNumberDecoration(this.apiService.phone);

    this.formCode.controls['code'].valueChanges
      .pipe(
        debounceTime(200),
        takeUntil(this.destroy$)
        )
      .subscribe(() => {
        this.saveLocalStorage();
        this.switchBtnNext(true);
      });

    this.timer$.pipe(
      tap(() => {
        this.saveLocalStorage();
      },
      takeUntil(this.destroy$)
      )
    ).subscribe();

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  saveLocalStorage(): void {
    const infoStep = Object.assign(
      this.formCode.value,
      {'timer': this.timer$.getValue()}
      );
    this.otherDataService.saveInLocalStorage(Steps.step2, infoStep);
  }

  switchBtnNext(flag: boolean): void {
    this.nextAccess = flag;
  }

  doAttempt(): void {
    this.switchBtnNext(false);
    if (this.attempt > 0) {
      this.attempt--;
    }

    if (this.attempt === 0) {
      this.formCode.disable();
    }
  }

  requestNewCode(): void {
    this.switchBtnNext(false);
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
    const valueFormCode = this.formCode.value.code;
    this.apiService.checkCode(valueFormCode)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((res: any) => {

      if (res.success) {
        this.otherDataService.generateNumberCard();
        this.router.navigate(['/registration']);
      } else {
        this.doAttempt();
        this.formCode.controls['code'].setErrors({ 'incorrect': true });
      }
    });
  }

}
