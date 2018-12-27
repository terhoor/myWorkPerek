import { Component, OnInit } from '@angular/core';
import { OtherDataService } from '../shared/services/other-data.service';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.css']
})
export class InfoPageComponent implements OnInit {

  constructor(
    private otherDataService: OtherDataService
  ) { }

  ngOnInit() {
  }

  openDialog(strInfo: string): void {
    this.otherDataService.openDialog(strInfo);
  }

}
