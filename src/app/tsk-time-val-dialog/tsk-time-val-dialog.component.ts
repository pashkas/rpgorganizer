import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './tsk-time-val-dialog.component.html',
  styleUrls: ['./tsk-time-val-dialog.component.css']
})
export class TskTimeValDialogComponent implements OnInit {
  name: Text;
  timeVal: number;

  constructor(public dialogRef: MatDialogRef<TskTimeValDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
    this.name = data.name;
    this.timeVal= data.timeVal;
  }

  cl(res) {
    this.dialogRef.close(res);
  }

  ngOnInit() {
  }
}
