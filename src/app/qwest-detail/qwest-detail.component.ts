import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersService } from '../pers.service';
import { Location } from '@angular/common';
import { Ability } from 'src/Models/Ability';
import { Pers } from 'src/Models/Pers';
import { Qwest } from 'src/Models/Qwest';
import { Reward } from 'src/Models/Reward';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { filter } from 'rxjs/operators';
import { AddOrEditRevardComponent } from '../add-or-edit-revard/add-or-edit-revard.component';

@Component({
  selector: 'app-qwest-detail',
  templateUrl: './qwest-detail.component.html',
  styleUrls: ['./qwest-detail.component.css']
})
export class QwestDetailComponent implements OnInit {
  isEditMode: boolean = false;
  /**
   * Добавление задачи из просмотра, когда квест выполнен.
   */
  isFromDoneQwest: boolean = false;
  qwest: Qwest;

  constructor(private location: Location, private route: ActivatedRoute, public srv: PersService, private router: Router, public dialog: MatDialog) { }

  /**
 * Добавить награду.
 */
  addNewRevard(r: Reward) {

    let header, isEdit;

    if (r) {
      header = 'Редактировать артефакт';
      isEdit = true;
    } else {
      header = 'Добавить артефакт';
      isEdit = false;
      r = new Reward();
      r.image = 'assets/icons/tresure.png';
    }

    this.srv.isDialogOpen = true;
    const dialogRef = this.dialog.open(AddOrEditRevardComponent, {
      panelClass: 'my-dialog',
      data: { header: header, rev: r, isArt: true },
      backdropClass: 'backdrop'
    });

    dialogRef.afterClosed()
      .subscribe(rev => {
        if (rev) {
          if (!isEdit) {
            r.count = 1;
            this.qwest.rewards.push(rev);
          }

          this.srv.sortRevards();
        }
        this.srv.isDialogOpen = false;
      });
  }

  /**
   * Добавление задачи.
   */
  addTask() {
    this.srv.isDialogOpen = true;
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      panelClass: 'my-dialog',
      data: { header: 'Добавить миссию', text: '' },

      backdropClass: 'backdrop'
    });

    dialogRef.afterClosed()
      .subscribe(name => {
        if (name) {
          this.srv.addTskToQwest(this.qwest, name);
        }
        this.srv.isDialogOpen = false;
      });
  }

  /**
   * Удаление награды.
   * @param id Идентификатор.
   */
  delReward(id: string) {
    this.qwest.rewards = this.qwest.rewards.filter(n => {
      return n.id != id;
    });
  }

  /**
   * Удаление задачи.
  * @param id Идентификатор.
  */
  delTask(id: string) {
    this.srv.delTaskfromQwest(this.qwest, id);
  }

  /**
   * Завершить квест.
   * @param qw Квест.
   */
  doneQwest(qw: Qwest) {
    this.srv.changesBefore();
    this.srv.DoneQwest(qw);
    this.router.navigate(['/pers']);
    this.srv.changesAfter(true);
  }

  /**
   * Сдвинуть задачу вниз.
   * @param i Индекс.
   */
  downTask(i: number) {
    if (this.qwest.tasks.length > i + 1) {
      let tmp = this.qwest.tasks[i];

      this.qwest.tasks[i] = this.qwest.tasks[i + 1];
      this.qwest.tasks[i + 1] = tmp;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.qwest.tasks, event.previousIndex, event.currentIndex);
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    if (!this.srv.pers) {
      this.router.navigate(['/main']);
    }

    const id = this.route.snapshot.paramMap.get('id');

    for (const qw of this.srv.pers.qwests) {
      if (qw.id === id) {
        this.qwest = qw;
        break;
      }
    }
  }

  setExp(i: number) {
    let exp = (this.srv.pers.nextExp - this.srv.pers.prevExp) * 10.0;
    let expChange = 0;

    switch (i) {
      case 1:
        expChange = exp * 0.25;
        break;
      case 2:
        expChange = exp * 0.5;
        break;
      case 3:
        expChange = exp * 1;
        break;

      default:
        break;
    }

    this.qwest.exp = Math.ceil(expChange);
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

  /**
   * Сдвинуть задачу вверх.
   * @param i Индекс задачи.
   */
  upTask(i: number) {
    if (i >= 1) {
      let tmp = this.qwest.tasks[i];

      this.qwest.tasks[i] = this.qwest.tasks[i - 1];
      this.qwest.tasks[i - 1] = tmp;
    }
  }
}
