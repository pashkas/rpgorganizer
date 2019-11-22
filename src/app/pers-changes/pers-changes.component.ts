import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-pers-changes',
  templateUrl: './pers-changes.component.html',
  styleUrls: ['./pers-changes.component.css']
})
export class PersChangesComponent implements OnInit {

  headText: string;
  changes: string[] = [];
  isGood: boolean = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.headText = data.headText;
    this.changes = data.changes;
    this.isGood = data.isGood;
   }

  ngOnInit() {
  }

}
