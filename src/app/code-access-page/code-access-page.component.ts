import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { OtherDataService } from '../shared/services/other-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../shared/services/api.service';
import { Steps } from '../shared/steps';
import { takeUntil, tap, debounceTime, catchError } from 'rxjs/operators';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { LSDataStep2 } from '../shared/interfaces/steps-models';
import { LocaleStorageService } from '../shared/services/locale-storage.service';

@Component({
  selector: 'app-code-access-page',
  templateUrl: './code-access-page.component.html',
  styleUrls: ['./code-access-page.component.css']
})
export class CodeAccessPageComponent implements OnInit, OnDestroy {

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private localData: LSDataStep2;
  private attempt: number;
  phoneNumber: string;
  nextAccess: boolean = false;
  formCode: FormGroup;

  constructor(
    private fb: FormBuilder,
    private otherDataService: OtherDataService,
    private router: Router,
    private apiService: ApiService,
    private localeStorageService: LocaleStorageService
  ) { }

  ngOnInit() {
    this.attempt = this.apiService.repeatCount;
    this.localData = this.localeStorageService.takeInLocalStorage(Steps.step2) || {};
    this.formCode = this.fb.group({
      code: [this.localData.code,
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });

    if (this.localData.code) {
    this.switchOnBtnNext();
    }

    this.phoneNumber = this.otherDataService.changeNumberDecoration(this.apiService.phone);

    this.formCode.statusChanges
      .pipe(
        takeUntil(this.destroy$)
        )
      .subscribe(() => {
        if (this.formCode.valid) {
          this.saveLocalStorage();
          this.switchOnBtnNext();
        } else {
          this.switchOffBtnNext();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private saveLocalStorage(): void {
    const newData = Object.assign(this.localData, this.formCode.value);
    this.localeStorageService.saveInLocalStorage(Steps.step2, newData);
  }

  private switchOnBtnNext(): void {
    this.nextAccess = this.haveAttempt();
  }

  private switchOffBtnNext(): void {
    this.nextAccess = false;
  }

  public haveAttempt(): boolean {
    return this.attempt > 0;
  }

  private doAttempt(): void {
    this.attempt--;
  }

  public requestNewCode(): void {
    this.switchOffBtnNext();
    this.repeatSentCode();
  }

  private repeatSentCode(): void {
    this.apiService.checkPhone(this.apiService.phone)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  public runCheckCode(): void {
    const valueFormCode = this.formCode.value.code;
    this.apiService.checkCode(valueFormCode)
    .pipe(
      takeUntil(this.destroy$),
      catchError((error) => {
        return of(error);
      })
    )
    .subscribe((res: any) => this.funcResponseCode(res));
  }

  private funcResponseCode(res: any = {}) {
      if (res.success) {
        this.otherDataService.generateNumberCard();
        this.router.navigate(['/registration']);
        return;
      }
      this.formCode.controls['code'].setErrors({'incorreсt': true});
      this.switchOffBtnNext();
      this.doAttempt();
  }

  public checkChar(event: KeyboardEvent): void {
    this.otherDataService.checkChar(event);
  }

}
