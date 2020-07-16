import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './arr-sort-dialog.component.html',
  styleUrls: ['./arr-sort-dialog.component.css']
})
export class ArrSortDialogComponent implements OnInit {

  taskA;
  taskB;

  constructor(public dialogRef: MatDialogRef<ArrSortDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
    this.taskA = data.aName;
    this.taskB = data.bName;
  }

  ngOnInit() {
  }

  cl(res) {
    this.dialogRef.close(res);
  }
}
