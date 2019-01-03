import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

interface InfoBlock {
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
    @Inject(MAT_DIALOG_DATA) public info: InfoBlock ) {}

    ngOnInit() {
    }

    close(): void {
    this.dialogRef.close();
  }

}
