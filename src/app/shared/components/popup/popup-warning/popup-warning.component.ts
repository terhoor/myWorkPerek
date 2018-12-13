import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-popup-warning',
  templateUrl: './popup-warning.component.html',
  styleUrls: ['./popup-warning.component.css']
})
export class PopupWarningComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PopupWarningComponent>) { }

  ngOnInit() {
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

}