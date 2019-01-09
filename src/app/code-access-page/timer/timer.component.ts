import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { OtherDataService } from 'src/app/shared/services/other-data.service';
import { Steps } from 'src/app/shared/steps';
import { tap, takeUntil } from 'rxjs/operators';
import { LSDataStep2 } from 'src/app/shared/interfaces/steps-models';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {

  timerEnd: boolean = false;
  localData: LSDataStep2;
  destroy$: Subject<boolean> = new Subject<boolean>();
  timer$: BehaviorSubject<number>;
  @Output() onRequestNewCode: EventEmitter<void> = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private otherDataService: OtherDataService
  ) { }

  ngOnInit() {
    this.localData = this.otherDataService.takeInLocalStorage(Steps.step2) || {};

    this.timer$ = new BehaviorSubject(this.localData.timer !== undefined ? this.localData.timer : this.apiService.repeatTime);

    this.timerTick();

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
    const newData = Object.assign(this.localData, {
      'timer': this.timer$.getValue()
    });

    this.otherDataService.saveInLocalStorage(Steps.step2, newData);
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
