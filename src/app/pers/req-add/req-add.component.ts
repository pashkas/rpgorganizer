import { Component, OnInit } from '@angular/core';
import { Reqvirement } from 'src/Models/Task';
import { PersService } from 'src/app/pers.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './req-add.component.html',
  styleUrls: ['./req-add.component.css']
})
export class ReqAddComponent implements OnInit {
  private unsubscribe$ = new Subject();

  abVals: number[] = [];
  abs: Reqvirement[] = [];
  req: Reqvirement = new Reqvirement();
  selReq: Reqvirement;
  selVal: number;

  constructor(private srv: PersService) { }

  ngOnDestroy(): void {
  this.unsubscribe$.next();
  this.unsubscribe$.complete();
}

  ngOnInit() {
    this.srv.pers$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(n=>{
      for (const ch of n.characteristics) {
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
    });
  }
}
