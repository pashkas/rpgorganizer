import { Component, OnInit } from '@angular/core';
import { PersService } from '../pers.service';
import { takeUntil, first } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Task } from 'src/Models/Task';
import { Pers } from 'src/Models/Pers';
import { Location } from '@angular/common';


@Component({
  selector: 'app-turnir-table',
  templateUrl: './turnir-table.component.html',
  styleUrls: ['./turnir-table.component.css']
})
export class TurnirTableComponent implements OnInit {

  private unsubscribe$ = new Subject();

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  champions$: Observable<any>;

  goBack() {
    this.location.back();
  }

  constructor(public srv: PersService, private router: Router, private location: Location) { }

  ngOnInit() {
    this.champions$ = this.srv.getChampions();

    if (!this.srv.pers$.value) {
      this.router.navigate(['/main']);
    }
  }

}
