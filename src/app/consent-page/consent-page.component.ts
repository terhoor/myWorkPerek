import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-consent-page',
  templateUrl: './consent-page.component.html',
  styleUrls: ['./consent-page.component.css']
})
export class ConsentPageComponent implements OnInit {

  consent = this.fb.group({
    telephone: [''],
    checkbox1: [''],
    checkbox2: ['']
  });
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }


  onSubmit() {
    console.log(this.consent);
    console.log(this.consent.value);
  }
}
