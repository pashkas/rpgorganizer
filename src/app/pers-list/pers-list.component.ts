import { Component, OnInit } from '@angular/core';
import { PersService } from '../pers.service';
import { Pers } from 'src/Models/Pers';
import { Characteristic } from 'src/Models/Characteristic';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Reward } from 'src/Models/Reward';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { Ability } from 'src/Models/Ability';
import { ImgCacheService } from 'ng-imgcache';
import { Task } from 'src/Models/Task';

@Component({
  selector: 'app-pers-list',
  templateUrl: './pers-list.component.html',
  styleUrls: ['./pers-list.component.css']
})
export class PersListComponent implements OnInit {
  private unsubscribe$ = new Subject();

  GameSettings = Pers.GameSettings;
  chaArea: string = "";
  isEditMode: boolean = false;
  isEditRev: boolean = false;
  newAbil: string;
  newCharact: string;
  newQwest: string;
  newRev: Reward = new Reward();
  newTsk: string;
  selAb: Ability;
  selCha: Characteristic;

  constructor(private location: Location, private route: ActivatedRoute, public srv: PersService, private router: Router) { }

  /**
   * Добавление навыка.
   */
  addAbil(charactId: string) {
    this.srv.addAbil(charactId, this.newAbil);
    this.newAbil = "";
  }

  /**
   * Добавление характеристки
   */
  addCharact() {
    this.srv.addCharact(this.newCharact);
    this.newCharact = "";
  }

  /**
   * Создание нового квеста.
   */
  addNewQwest() {
    this.srv.addQwest(this.newQwest);
    this.newQwest = "";
  }

  /**
 * Добавить награду.
 */
  addNewRevard() {
    if (!this.isEditRev) {
      this.srv.AddRevard(this.newRev.name, this.newRev.probability, this.newRev.descr);
    }

    this.srv.countToatalRewProb();
    this.newRev = new Reward();
  }

  addTask() {
    this.srv.addTsk(this.selAb, this.newTsk);
    this.newTsk = "";
  }

  /**
   * Удаление навыка.
   * @param id Идентификатор.
   */
  delAbil(id: string) {
    this.srv.delAbil(id);
  }

  /**
 * Удаляем характеристику.
 * @param uuid Идентификатор.
 */
  delCharact(uuid) {
    this.srv.DeleteCharact(uuid);
  }

  /**
   * Удалить квест.
   * @param id Идентификатор квеста.
   */
  delQwest(id: string) {
    this.srv.delQwest(id);
  }

  /**
   * Удаление трофея.
   * @param id Идентификатор.
   */
  delReward(id: string) {
    this.srv.delReward(id);
  }

  delTask(ab: Ability, id: string) {
    this.srv.delTask(ab, id);
  }

  getDateString(dt: Date) {
    if (dt === undefined || dt === null) {
      return "";
    }

    let date = new Date(dt);
    return date.toLocaleDateString([], { day: 'numeric', month: 'numeric' });
  }

  goBack() {
    //this.location.back();
    this.router.navigate(['/main']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    if (!this.srv.pers) {
      this.router.navigate(['/main']);
    }
  }

  upAbil(ab:Ability) {
    this.srv.changesBefore();

    this.srv.upAbility(ab);

    this.srv.changesAfter(true);
  }

  /**
   * Респаун.
   */
  resp() {
    if (window.confirm('Вы уверены?')) {
      this.srv.pers.characteristics.forEach(cha => {
        cha.abilities.forEach(ab => {
          ab.tasks.forEach(tsk => {
            tsk.value = 0;
            tsk.date = new Date();
            tsk.image = this.srv.GetRndEnamy(tsk);
            tsk.lastNotDone = false;
            this.srv.setStatesNotDone(tsk);
            // tsk.order = 999;
          });
        });
      });

      this.srv.pers.exp = 0;
      this.srv.pers.level = 0;
      this.srv.pers.inventory = [];
      //this.srv.pers.qwests = [];

      this.srv.savePers(false);
    }
  }

  /**
   * Сохранить данные.
   */
  saveData() {
    if (this.isEditMode) {
      this.srv.savePers(false);
      this.isEditMode = false;
    }
    else {
      this.isEditMode = true;
    }
  }

  showAbility(ab: Ability) {
    this.srv.showAbility(ab);
  }

  /**
   * Использование награды.
   * @param rev Награда.
   */
  useRevard(rev: Reward) {
    this.srv.changesBefore();

    // Уменьшаем количество если их больше чем 1
    if (rev.count >= 2) {
      rev.count = rev.count - 1;
    }
    else {
      // Удаляем из инвентаря
      this.srv.delInventoryItem(rev);
    }

    this.srv.savePers(true);

    this.srv.changesAfter(null);
  }
}
