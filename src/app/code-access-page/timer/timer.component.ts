import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { Steps } from 'src/app/shared/steps';
import { tap, takeUntil } from 'rxjs/operators';
import { LSDataStep2 } from 'src/app/shared/interfaces/steps-models';
import { LocaleStorageService } from 'src/app/shared/services/locale-storage.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {

  timerEnd: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  timer$: BehaviorSubject<number>;
  @Output() onRequestNewCode: EventEmitter<void> = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private localeStorageService: LocaleStorageService,
  ) { }

  ngOnInit() {
    const localData: LSDataStep2 = this.getLocalStorage();

    this.timer$ = new BehaviorSubject(localData.timer !== undefined ? localData.timer : this.apiService.repeatTime);

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

  getLocalStorage(): LSDataStep2 {
    return this.localeStorageService.takeInLocalStorage(Steps.step2) || {};
  }

  saveInLocalStorage(newData: LSDataStep2): void {
    this.localeStorageService.saveInLocalStorage(Steps.step2, newData);
  }

  saveLocalStorage(): void {
    const localData = this.getLocalStorage();
    const newData = Object.assign(localData, {
      'timer': this.timer$.getValue()
    });
    this.saveInLocalStorage(newData);
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
    this.timer$.next(this.getNewRepeatTime());
    this.timerEnd = false;
  }

  getNewRepeatTime(): number {
    return this.apiService.repeatTime;
  }


}
