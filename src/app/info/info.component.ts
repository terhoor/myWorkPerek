import { Component, OnInit } from '@angular/core';
import { OtherDataService } from '../shared/services/other-data.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  constructor(
    private otherDataService: OtherDataService
  ) { }

  ngOnInit() {
  }

  openDialog(strInfo) {
    this.otherDataService.openDialog(strInfo);
  }

}
