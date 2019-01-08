import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  timerEnd: boolean = false;
  @Input() repeatTime: number;
  @Input() timer$: BehaviorSubject<number>;
  @Output() onRequestNewCode: EventEmitter<void> = new EventEmitter();

  constructor(
    private apiService: ApiService

  ) { }

  ngOnInit() {
    this.timerTick();
  }

  requestNewCode() {
    this.startTimer();
    this.onRequestNewCode.emit();
  }

  timerTick(): void {
    const myTimer = setInterval(() => {
      let valueTimer = this.timer$.getValue();
      if (valueTimer === 0) {
        clearTimeout(myTimer);
        this.timerEnd = true;
        return;
      }
      valueTimer--;
      this.timer$.next(valueTimer);

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


}
