import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

interface infoBlock {
  title: string;
  text: string;
}

@Component({
  selector: 'app-popup-info',
  templateUrl: './popup-info.component.html',
  styleUrls: ['./popup-info.component.css']
})
export class PopupInfoComponent implements OnInit {

  whatShow: string;
  constructor(
    public dialogRef: MatDialogRef<PopupInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public info: infoBlock ) {}

    ngOnInit() {
      // this.whatShow = this.strInfo;
    }

    close(): void {
    this.dialogRef.close();
  }

}