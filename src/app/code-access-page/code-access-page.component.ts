import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { OtherDataService } from '../shared/services/other-data.service';

@Component({
  selector: 'app-code-access-page',
  templateUrl: './code-access-page.component.html',
  styleUrls: ['./code-access-page.component.css']
})
export class CodeAccessPageComponent implements OnInit {
  phoneNumber: string;
  isValidForm: boolean;
  timer: number = 2;
  timerEnd: boolean = false;
  formCode = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
  });
  constructor(
    private fb: FormBuilder,
    private otherDataService: OtherDataService) { }

  ngOnInit() {
    this.otherDataService.phoneNumber.subscribe((numberStr) => {

      this.phoneNumber = numberStr.replace(/^(\+\d)(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/, '$1 ($2) $3-$4-$5');
    });
    
    this.timerTick();
  }

  timerTick() {
    const myTimer = setInterval(() => {

      if (this.timer === 0) {
        clearTimeout(myTimer);
        this.timerEnd = true;
        return;
      }
      this.timer--;
    }, 1000);

    console.log(this.timer);
  }

  startTimer() {
    this.timerEnd = false;
    this.timer = 2;
    this.timerTick();
  }

}
