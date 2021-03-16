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
import { ChangeCharactComponent } from '../pers/change-charact/change-charact.component';

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
  isFromMain: boolean;
  nextQwests: Qwest[] = [];
  prevQwest: Qwest;
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

  addNextQwest() {
    this.srv.isDialogOpen = true;
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      panelClass: 'my-dialog',
      data: { header: 'Добавить следующий квест', text: '' },

      backdropClass: 'backdrop'
    });

    dialogRef.afterClosed()
      .subscribe(name => {
        if (name) {
          this.srv.addQwest(name, this.qwest.id, this.qwest.image, this.qwest.abilitiId);
        }
        this.srv.isDialogOpen = false;
        this.getNextPrevQwests();
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
    if (this.isFromMain) {
      this.router.navigate(['/main']);
    }
    else {
      this.router.navigate(['/pers']);
    }

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

  getNextPrevQwests() {
    let nextQw: Qwest[] = [];
    let prevQwest;

    for (const qw of this.srv.pers.qwests) {
      if (qw.parrentId === this.qwest.id) {
        nextQw.push(qw);
      }
      else if (qw.id === this.qwest.parrentId) {
        prevQwest = qw;
      }
    }

    this.nextQwests = nextQw;
    this.prevQwest = prevQwest;
  }

  chooseNextQwest() {
    this.srv.isDialogOpen = true;
    const dialogRef = this.dialog.open(ChangeCharactComponent, {
      panelClass: 'my-big',
      data: { characteristic: this.qwest, allCharacts: this.srv.pers.qwests.sort((a, b) => a.name.localeCompare(b.name)), tittle: 'Выберите квест' },
      backdropClass: 'backdrop'
    });

    dialogRef.afterClosed()
      .subscribe(n => {
        if (n) {
          if (n.id != this.qwest.id) {
            for (const qw of this.srv.pers.qwests) {
              if (qw.id == n.id) {
                qw.parrentId = this.qwest.id;

                break;
              }
            }
          }
        }
        this.srv.isDialogOpen = false;
        this.getNextPrevQwests();
      });
  }

  delNextQwest(id) {
    for (const qw of this.srv.pers.qwests) {
      if (qw.id === id) {
        qw.parrentId = null;
        break;
      }
    }

    this.getNextPrevQwests();
  }

  goBack() {
    if (this.isEditMode) {
      this.isEditMode = false;
    }
    else {
      this.location.back();
    }
  }

  ngOnInit() {
    if (!this.srv.pers) {
      this.router.navigate(['/main']);
    }


    this.route.params.subscribe(n => {
      const id = n['id'];
      const fromMain = n['fromMain'];

      if (fromMain) {
        this.isFromMain = true;
      }
      else {
        this.isFromMain = false;
      }

      for (const qw of this.srv.pers.qwests) {
        if (qw.id === id) {
          this.qwest = qw;
          break;
        }
      }

      this.getNextPrevQwests();
      this.getQwestAb();
    });
  }

  qwestAbiliti;

  getQwestAb() {
    let qwAb = null;
    if (this.qwest.abilitiId) {
      for (const ch of this.srv.pers.characteristics) {
        for (const ab of ch.abilities) {
          if (ab.id == this.qwest.abilitiId) {
            qwAb = ab;
            break;
          }
        }
      }
    }
    this.qwestAbiliti = qwAb;
  }

  setAbil() {
    this.srv.isDialogOpen = true;
    const dialogRef = this.dialog.open(ChangeCharactComponent, {
      data: {
        characteristic: this.qwestAbiliti,
        allCharacts: this.srv.pers.characteristics
          .reduce((a, b) => {
            return a.concat(b.abilities)
          }, [])
          .sort((a, b) => a.name.localeCompare(b.name)),
        tittle: 'Выбери навык'
      },
      backdropClass: 'backdrop'
    });

    dialogRef.afterClosed()
      .subscribe(n => {
        if (n) {
          this.qwest.abilitiId = n.id;
          this.qwestAbiliti = n;
        }
        this.srv.isDialogOpen = false;
      });
  }

  delAb() {
    this.qwest.abilitiId = null;
    this.qwestAbiliti = null;
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
