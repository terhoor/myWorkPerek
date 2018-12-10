import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { OtherDataService } from '../shared/services/other-data.service';
import { MyCode } from '../shared/interfaces/code.model';

@Component({
  selector: 'app-code-access-page',
  templateUrl: './code-access-page.component.html',
  styleUrls: ['./code-access-page.component.css']
})
export class CodeAccessPageComponent implements OnInit {

  private myCode: string;
  private attempt: number = 3;
  timer: number = 5;
  phoneNumber: string;
  codeValid: boolean;
  timerEnd: boolean = false;
  formCode = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
  });
  constructor(
    private fb: FormBuilder,
    private otherDataService: OtherDataService) { }

  ngOnInit() {
    this.otherDataService.getCode().subscribe(({code}: MyCode) => {
      this.myCode = code;
    });
    this.otherDataService.phoneNumber.subscribe((numberStr) => {

      this.phoneNumber = numberStr.replace(/^(\+\d)(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/, '$1 ($2) $3-$4-$5');
    });

    this.formCode.controls['code'].valueChanges.subscribe(() => {
      this.checkCodeInInput();
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
    }
  }

  checkCodeInInput(): void {
    if (this.formCode.disabled) {
      return;
    }

    const value = this.formCode.controls['code'].value;
    if (value.length === 5) {
      this.codeValid = (value === this.myCode);

      if (!this.codeValid) {
        this.doAttempt();
      }

    }
  }

  checkChar(event): boolean {
    return event.charCode >= 48 && event.charCode <= 57;
  }

}
