import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { OtherDataService } from '../shared/services/other-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-code-access-page',
  templateUrl: './code-access-page.component.html',
  styleUrls: ['./code-access-page.component.css']
})
export class CodeAccessPageComponent implements OnInit {

  attempt: number = this.apiService.repeatCount;
  timer: number = this.apiService.repeatTime;
  phoneNumber: string;
  nextAccess: boolean;
  timerEnd: boolean = false;
  formCode: FormGroup;
  step: string = 'step2';
  constructor(
    private fb: FormBuilder,
    private otherDataService: OtherDataService,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
    ) { }

  ngOnInit() {
    const localData = this.otherDataService.takeInLocalStorage(this.step) || {};

    this.formCode = this.fb.group({
      code: [localData.code || '', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });

    this.phoneNumber = this.otherDataService.changeNumberDecoration(this.apiService.phone);

    this.formCode.controls['code'].valueChanges.subscribe(() => {
      this.nextAccess = true;
    });

    this.timerTick();
  }

  timerTick(): void {
    const myTimer = setInterval(() => {

      this.timer--;
      if (this.timer === 0) {
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
    this.timer = this.apiService.repeatTime;
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
