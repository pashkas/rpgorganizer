import { Component, OnInit, Inject } from '@angular/core';
import { Reward } from 'src/Models/Reward';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Pers } from 'src/Models/Pers';

@Component({
  selector: 'app-add-or-edit-revard',
  templateUrl: './add-or-edit-revard.component.html',
  styleUrls: ['./add-or-edit-revard.component.css']
})
export class AddOrEditRevardComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data) { }

  revTypes: string[] = [Pers.commonRevSet.name, Pers.uncommonRevSet.name, Pers.rareRevSet.name, Pers.epicRevSet.name, Pers.legendaryRevSet.name];

  ngOnInit() {
  }

}
