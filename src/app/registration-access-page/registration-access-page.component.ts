import { Component, OnInit } from '@angular/core';
import { OtherDataService } from '../shared/services/other-data.service';

@Component({
  selector: 'app-registration-access-page',
  templateUrl: './registration-access-page.component.html',
  styleUrls: ['./registration-access-page.component.css']
})
export class RegistrationAccessPageComponent implements OnInit {

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
