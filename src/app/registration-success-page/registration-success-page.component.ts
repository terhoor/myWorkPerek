import { Component, OnInit } from '@angular/core';
import { OtherDataService } from '../shared/services/other-data.service';

@Component({
  selector: 'app-registration-success-page',
  templateUrl: './registration-success-page.component.html',
  styleUrls: ['./registration-success-page.component.css']
})
export class RegistrationSuccessPageComponent implements OnInit {

  constructor(
    private otherDataService: OtherDataService
  ) { }

  ngOnInit() {
    localStorage.clear();
  }


  openDialog(strInfo: string): void {
    this.otherDataService.openDialog(strInfo);
  }
}
