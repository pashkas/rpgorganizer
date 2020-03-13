import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './change-charact.component.html',
  styleUrls: ['./change-charact.component.css']
})
export class ChangeCharactComponent implements OnInit {

  characteristic;
  allCharacts;

  constructor(@Inject(MAT_DIALOG_DATA) private data) { }

  ngOnInit() {
    this.characteristic = this.data.characteristic;
    this.allCharacts = this.data.allCharacts;
  }

}
