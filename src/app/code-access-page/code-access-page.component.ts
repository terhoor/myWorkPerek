import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { OtherDataService } from '../shared/services/other-data.service';
import { Router } from '@angular/router';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-code-access-page',
  templateUrl: './code-access-page.component.html',
  styleUrls: ['./code-access-page.component.css']
})
export class CodeAccessPageComponent implements OnInit {

  private attempt: number = 3;
  timer: number = 5;
  phoneNumber: string;
  nextAccess: boolean;
  timerEnd: boolean = false;
  formCode = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
  });
  constructor(
    private fb: FormBuilder,
    private otherDataService: OtherDataService,
    private router: Router,
    private apiService: ApiService
    ) { }

  ngOnInit() {
    this.phoneNumber = this.otherDataService.changeNumberDecore(this.apiService.phone);

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
    this.timer = 10;
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
    console.log(this.formCode.controls['code']);

    return event.charCode >= 48 && event.charCode <= 57;
  }

  checkCode() {
    const valueFormCode = this.formCode.value.code;
    this.apiService.checkCode(valueFormCode).subscribe((res: any) => {
      
      if (res.success) {
        this.router.navigate(['/registration']);

      } else {
        this.doAttempt();
        console.log(res);
        this.formCode.controls['code'].setErrors({'incorrect': true});
        console.log(this.formCode.controls['code']);
      }
    });
  }

}
