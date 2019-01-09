import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-btn-next',
  templateUrl: './btn-next.component.html',
  styleUrls: ['./btn-next.component.css']
})
export class BtnNextComponent implements OnInit {
  @Input() disBtn: boolean;

  constructor() { }

  ngOnInit() {
  }

}
