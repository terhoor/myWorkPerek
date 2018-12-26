import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { OtherDataService } from '../shared/services/other-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../shared/services/api.service';
import { Steps } from '../shared/steps';
import { switchMap, mergeMap, withLatestFrom } from 'rxjs/operators';
import { merge, combineLatest, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-code-access-page',
  templateUrl: './code-access-page.component.html',
  styleUrls: ['./code-access-page.component.css']
})
export class CodeAccessPageComponent implements OnInit {

  attempt: number = this.apiService.repeatCount;
  timer$: BehaviorSubject<number>;
  phoneNumber: string;
  nextAccess: boolean;
  timerEnd: boolean = false;
  formCode: FormGroup;
  constructor(
    private fb: FormBuilder,
    private otherDataService: OtherDataService,
    private router: Router,
    private apiService: ApiService
    ) { }

  ngOnInit() {
    const localData = this.otherDataService.takeInLocalStorage(Steps.step2) || {};

    this.formCode = this.fb.group({
      code: [localData.code || '', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });

    this.timer$ = new BehaviorSubject(localData.timer || this.apiService.repeatTime);


    this.phoneNumber = this.otherDataService.changeNumberDecoration(this.apiService.phone);

    merge(this.timer$, this.formCode.controls['code'].valueChanges)
    .subscribe(() => {
      this.nextAccess = true;
      const infoStep = Object.assign(this.formCode.value, {'timer': this.timer$.getValue()});
      this.otherDataService.saveInLocalStorage(Steps.step2, infoStep);
    });

    this.timerTick();
  }

  timerTick(): void {
    const myTimer = setInterval(() => {
      const valueTimer = this.timer$.getValue() - 1;
      this.timer$.next(valueTimer;
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
    if (this.attempt > 0) {
      this.attempt--;
    }

    if (this.attempt === 0) {
      this.formCode.disable();
      this.nextAccess = false;
    }
  }

  checkChar(event): boolean {
    return event.charCode >= 48 && event.charCode <= 57;
  }

  checkCode() {
    const valueFormCode = this.formCode.value.code;
    this.apiService.checkCode(valueFormCode).subscribe((res: any) => {

      if (res.success) {
        this.otherDataService.generateNumberCard();
        this.router.navigate(['/registration'], {
          queryParams: {
            access: true
          }
        });
      } else {
        this.doAttempt();
        this.formCode.controls['code'].setErrors({'incorrect': true});
      }
    });
  }

}
