import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-btn-back',
  templateUrl: './btn-back.component.html',
  styleUrls: ['./btn-back.component.css']
})
export class BtnBackComponent implements OnInit {

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
  }

  locationBack() {
    this.location.back();
  }
}
