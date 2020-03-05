import { Component, OnInit } from '@angular/core';
import { PersService } from '../pers.service';
import { Pers } from 'src/Models/Pers';
import { Characteristic } from 'src/Models/Characteristic';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Reward } from 'src/Models/Reward';
import { Subject } from 'rxjs';
import { Ability } from 'src/Models/Ability';
import { MatDialog } from '@angular/material';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { AddOrEditRevardComponent } from '../add-or-edit-revard/add-or-edit-revard.component';
import { Qwest } from 'src/Models/Qwest';

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
  selAb: Ability;
  selCha: Characteristic;

  constructor(private location: Location, private route: ActivatedRoute, public srv: PersService, private router: Router, public dialog: MatDialog) { }

  /**
   * Добавление навыка.
   */
  addAbil(charactId: string) {
    this.srv.isDialogOpen = true;
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      panelClass: 'my-dialog',
      data: { header: 'Добавить навык', text: '' },
      backdropClass: 'backdrop'
    });

    dialogRef.afterClosed()
      .subscribe(name => {
        if (name) {
          this.srv.addAbil(charactId, name);
        }
        this.srv.isDialogOpen = false;
      });
  }

  /**
   * Добавление характеристки
   */
  addCharact() {
    this.srv.isDialogOpen = true;
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      panelClass: 'my-dialog',
      data: { header: 'Добавить характеристику', text: '' },
      backdropClass: 'backdrop'
    });

    dialogRef.afterClosed()
      .subscribe(name => {
        if (name) {
          this.srv.addCharact(name);
        }
        this.srv.isDialogOpen = false;
      });
  }

  /**
   * Создание нового квеста.
   */
  addNewQwest() {
    this.srv.isDialogOpen = true;
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      panelClass: 'my-dialog',
      data: { header: 'Добавить квест', text: '' },
      backdropClass: 'backdrop'
    });

    dialogRef.afterClosed()
      .subscribe(name => {
        if (name) {
          this.srv.addQwest(name);
        }
        this.srv.isDialogOpen = false;
      });
  }

  /**
 * Добавить награду.
 */
  addNewRevard(r) {
    let header, isEdit;

    if (r) {
      header = 'Редактировать трофей';
      isEdit = true;
    } else {
      header = 'Добавить трофей';
      isEdit = false;
      r = new Reward();
      r.image = 'assets/icons/tresure.png';
    }

    this.srv.isDialogOpen = true;
    const dialogRef = this.dialog.open(AddOrEditRevardComponent, {
      panelClass: 'my-dialog',
      data: { header: header, rev: r },
      backdropClass: 'backdrop'
    });

    dialogRef.afterClosed()
      .subscribe(rev => {
        if (rev) {
          if (!isEdit) {
            this.srv.AddRevard(rev);
          }

          this.srv.sortRevards();
        }
        this.srv.isDialogOpen = false;
      });
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

  /**
   * Завершить квест.
   * @param qw Квест.
   */
  doneQwest(qw: Qwest) {
    this.srv.changesBefore();
    this.srv.DoneQwest(qw);
    this.srv.changesAfter(true);
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

    const id = this.route.snapshot.paramMap.get('isFirst');
    if (id) {
      this.srv.selTabPersList = 0;
    }
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
            this.srv.GetRndEnamy(tsk);
            tsk.states.forEach(st => {
              this.srv.GetRndEnamy(st);
            });
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

  upAbil(ab: Ability) {
    this.srv.changesBefore();

    this.srv.upAbility(ab);

    this.srv.changesAfter(true);
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
