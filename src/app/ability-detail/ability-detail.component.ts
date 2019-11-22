import { Component, OnInit } from '@angular/core';
import { Pers } from 'src/Models/Pers';
import { Characteristic } from 'src/Models/Characteristic';
import { Rangse } from 'src/Models/Rangse';
import { Ability } from 'src/Models/Ability';
import { ActivatedRoute, Router } from '@angular/router';
import { PersService } from '../pers.service';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ability-detail',
  templateUrl: './ability-detail.component.html',
  styleUrls: ['./ability-detail.component.css']
})
export class AbilityDetailComponent implements OnInit {
  private unsubscribe$ = new Subject();

  abil: Ability;
  isEditMode: boolean = false;
  newTsk: string;

  // rangse: Rangse[] = Ability.rangse;

  constructor(private location: Location, private route: ActivatedRoute, public srv: PersService, private router: Router) { }

  /**
   * Добавление задачи.
   */
  addTask() {
    this.srv.addTsk(this.abil, this.newTsk);
    this.newTsk = "";
  }

  /**
  * Удаление задачи.
  * @param id Идентификатор.
  */
  delTask(id: string) {
    this.srv.delTask(this.abil, id);
  }

  getDateString(dt: Date) {
    if (dt === undefined || dt === null) {
      return "";
    }

    let date = new Date(dt);
    return date.toLocaleDateString([], { day: 'numeric', month: 'numeric' });
  }

  getTimeString(dt: Date) {
    if (dt === undefined || dt === null) {
      return "";
    }

    let date = new Date(dt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {

    if (!this.srv.pers) {
      this.router.navigate(['/main']);
    }

    const id = this.route.snapshot.paramMap.get('id');
    this.srv.pers.characteristics.forEach(cha => {
      cha.abilities.forEach(ab => {
        if (ab.id === id) {
          this.abil = ab;
        }
      });
    });

  }

  /**
   * Сохранить данные.
   */
  saveData() {
    this.srv.savePers(false);
  }
}
