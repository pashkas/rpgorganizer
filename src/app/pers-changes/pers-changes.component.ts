import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ChangesModel } from 'src/Models/ChangesModel';
import { AnimationBuilder, style, animate } from '@angular/animations';
import { PersService } from '../pers.service';

@Component({
  selector: 'app-pers-changes',
  templateUrl: './pers-changes.component.html',
  styleUrls: ['./pers-changes.component.css']
})
export class PersChangesComponent implements OnInit {

  headText: string;
  changes: ChangesModel[] = [];
  isGood: boolean = true;
  counto: number[] = [];
  slidingDoorValue: string = 'out';
  abPoints: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.headText = data.headText;
    this.changes = data.changes;
    this.changes.forEach(element => {
      this.counto.push(element.valFrom);
    });
    this.isGood = data.isGood;
    this.abPoints = data.abPoints;
    if (data.isTES) {
      this.abPoints = null;
    }
  }

  ngOnInit() {

  }
}
