import { Component, OnInit } from '@angular/core';
import { Reqvirement } from 'src/Models/Task';
import { PersService } from 'src/app/pers.service';

@Component({
  templateUrl: './req-add.component.html',
  styleUrls: ['./req-add.component.css']
})
export class ReqAddComponent implements OnInit {
  req: Reqvirement = new Reqvirement();
  abs: Reqvirement[] = [];
  abVals: number[] = [];

  selReq: Reqvirement;
  selVal: number;

  constructor(private srv: PersService) { }

  ngOnInit() {
    for (const ch of this.srv.pers.characteristics) {
      for (const ab of ch.abilities) {
        for (const t of ab.tasks) {
          let r = new Reqvirement();
          r.elName = t.name;
          r.elVal = 10;
          r.elId = t.id;
          this.abs.push(r);
        }
      }
    }

    this.selVal = 10;

    this.abs = this.abs.sort((a, b) => a.elName.localeCompare(b.elName));

    for (let i = 1; i <= 10; i++) {
      this.abVals.push(i);
    }
  }

}
