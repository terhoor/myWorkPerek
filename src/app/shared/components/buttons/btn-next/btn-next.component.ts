import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-btn-next',
  templateUrl: './btn-next.component.html',
  styleUrls: ['./btn-next.component.css']
})
export class BtnNextComponent implements OnInit {
  private _isValid: boolean = false;
  @Input()
  set isValid(isValid: boolean) {
    this._isValid = !isValid;
  }

  get isValid(): boolean {
    return this._isValid;
  }
  constructor() { }

  ngOnInit() {
  }

}
