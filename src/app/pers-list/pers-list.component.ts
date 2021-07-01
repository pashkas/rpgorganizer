import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { StatesService } from '../states.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pers-list',
  templateUrl: './pers-list.component.html',
  styleUrls: ['./pers-list.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PersListComponent implements OnInit {
  private unsubscribe$ = new Subject();

  GameSettings = Pers.GameSettings;
  chaArea: string = "";
  isEditMode: boolean = false;
  pers: Pers;
  selAb: Ability;
  selCha: Characteristic;

  constructor(private location: Location, public srvSt: StatesService, private route: ActivatedRoute, public srv: PersService, private router: Router, public dialog: MatDialog) { }

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

  addOnlyAb() {
    let firstCharact: Characteristic;
    if (this.pers.characteristics.length > 0) {
      firstCharact = this.pers.characteristics[0];
    }
    else {
      this.srv.addCharact('');
      firstCharact = this.pers.characteristics[0];
    }

    this.addAbil(firstCharact.id);
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

  goBack() {
    if (this.isEditMode) {
      this.isEditMode = false;
    }
    else{
      this.location.back();
    }
  }

  loadSamplePers(){
    if (window.confirm('Вы уверены, что хотите загрузить тренировочного перса?')) {
      this.srv.loadLearningPers(this.pers.userId);
      this.saveData();
    }
  }

  newgame(){
    if (window.confirm('Вы уверены, что хотите очистить все данные?')) {
      this.srv.setNewPers(this.pers.userId);
      this.saveData();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    if (!this.srv.pers$.value) {
      this.router.navigate(['/main']);
    }

    const id = this.route.snapshot.paramMap.get('isFirst');
    if (id) {
      this.srvSt.selTabPersList = 0;
    }

    this.srv.pers$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(n=>{
      this.pers=n;
    });
  }

  /**
   * Респаун.
   */
  resp() {
    if (window.confirm('Вы уверены?')) {
      this.pers.isOffline = true;
      this.pers.characteristics.forEach(cha => {
        cha.abilities.forEach(ab => {
          ab.isOpen = false;
          ab.tasks.forEach(tsk => {
            this.srv.GetRndEnamy(tsk, this.pers.level, this.pers.maxPersLevel);
            tsk.failCounter = 0;
            // tsk.time = "00:00";
            tsk.value = 0;
            tsk.tesValue = 0;
            tsk.refreshCounter = 0;
            tsk.date = new Date();
            this.srv.GetRndEnamy(tsk, this.pers.level, this.pers.maxPersLevel);
            tsk.states.forEach(st => {
              // st.time = "00:00";
              this.srv.GetRndEnamy(st, this.pers.level, this.pers.maxPersLevel);
            });
            tsk.lastNotDone = false;
            this.srv.setStatesNotDone(tsk);
          });
        });
      });

      // Обновление картинок квестов
      this.srv.updateQwestTasksImages(this.pers);

      this.pers.expKoef = 0;
      this.pers.exp = 0;
      this.pers.level = 0;
      this.pers.inventory = [];

      // this.srv.clearDiary(); 
      // там тоже перс сохраняется...
      this.saveData();
    }
  }

  rest(){
    this.pers.isRest = true;
    this.srv.savePers(false);
    this.router.navigate(['/main']);
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

  sync(isDownload){
    this.srv.sync(isDownload);
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
