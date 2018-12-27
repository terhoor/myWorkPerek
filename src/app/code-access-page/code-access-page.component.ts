import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { OtherDataService } from '../shared/services/other-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../shared/services/api.service';
import { Steps } from '../shared/steps';
import { takeUntil } from 'rxjs/operators';
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
  nextAccess: boolean;
  timerEnd: boolean = false;
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
      this.nextAccess = true;
    }

    this.timer$ = new BehaviorSubject(localData.timer || this.apiService.repeatTime);
    this.phoneNumber = this.otherDataService.changeNumberDecoration(this.apiService.phone);

    this.timer$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.saveLocalStorage();
      });

    this.formCode.controls['code'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.nextAccess = true;
        this.saveLocalStorage();
      });

    this.timerTick();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  saveLocalStorage() {
    const infoStep = Object.assign(
      this.formCode.value,
      {'timer': this.timer$.getValue()}
      );
    this.otherDataService.saveInLocalStorage(Steps.step2, infoStep);
  }

  timerTick(): void {
    const myTimer = setInterval(() => {
      const valueTimer = this.timer$.getValue() - 1;
      this.timer$.next(valueTimer);

      if (valueTimer === 0) {
        clearTimeout(myTimer);
        this.timerEnd = true;
      }
    }, 1000);
  }

  startTimer(): void {
    this.timerReset();
    this.timerTick();
  }

  timerReset(): void {
    this.timer$.next(this.apiService.repeatTime);
    this.timerEnd = false;
  }

  doAttempt(): void {
    this.nextAccess = false;
    if (this.attempt > 0) {
      this.attempt--;
    }

    if (this.attempt === 0) {
      this.formCode.disable();
    }
  }

  checkChar(event) {
    const numberKey = Number(String.fromCharCode(event.keyCode));
    if (isNaN(numberKey)) {
      event.preventDefault();
    }
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
        this.router.navigate(['/registration'], {
          queryParams: {
            access: true
          }
        });
      } else {
        this.doAttempt();
        this.formCode.controls['code'].setErrors({ 'incorrect': true });
      }
    });
  }

}
