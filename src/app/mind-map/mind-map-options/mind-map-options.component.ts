import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

@Component({
  templateUrl: './mind-map-options.component.html',
  styleUrls: ['./mind-map-options.component.css']
})
export class MindMapOptionsComponent implements OnInit {

  constructor(private _bottomSheetRef: MatBottomSheetRef<MindMapOptionsComponent>) { }

  ngOnInit() {

  }

  choose(ev) {
    this._bottomSheetRef.dismiss(ev);
  }

}
