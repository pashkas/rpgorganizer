import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pers } from 'src/Models/Pers';
import { PersService } from '../pers.service';
import { Task } from 'src/Models/Task';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { ImgCacheService } from 'ng-imgcache';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { Ability } from 'src/Models/Ability';
import { MatDialog } from '@angular/material';
import { LevelUpMsgComponent } from '../level-up-msg/level-up-msg.component';
import { DiaryEditParamsComponent } from '../diary/diary-edit-params/diary-edit-params.component';
import { sortArr } from 'src/Models/sortArr';
import { ArrSortDialogComponent } from '../arr-sort-dialog/arr-sort-dialog.component';
import * as moment from 'moment';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { TskTimeValDialogComponent } from '../tsk-time-val-dialog/tsk-time-val-dialog.component';
import { StatesService } from '../states.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { curpersview } from 'src/Models/curpersview';
import { Qwest } from 'src/Models/Qwest';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class MainWindowComponent implements OnInit {
  private unsubscribe$ = new Subject();

  isFailShown = false;
  isFailShownOv = false;
  isSort: boolean = false;
  isSucessShown = false;
  isSucessShownOv = false;
  lastGlobalBeforeSort: boolean;
  qwickSortVals: sortArr[] = [];
  pers: Pers;

  constructor(private route: ActivatedRoute, public srv: PersService, public dialog: MatDialog, private srvSt: StatesService, private router: Router) {
  }

  addToQwest() {
    let qwest = this.srv.allMap[this.srv.pers$.value.currentQwestId].item;

    if (qwest) {
      const dialogRef = this.dialog.open(AddItemDialogComponent, {
        panelClass: 'my-dialog',
        data: { header: 'Добавить миссию', text: '' },

        backdropClass: 'backdrop'
      });

      dialogRef.afterClosed()
        .subscribe(name => {
          if (name) {
            this.srv.addTskToQwest(qwest, name);
            this.srv.savePers(false);
          }
        });
    }
  }

  async animate(isDone: boolean) {
    if (isDone) {
      this.isSucessShownOv = true;
      await this.delay(250);
      this.isSucessShownOv = false;
      this.isSucessShown = true;
      await this.delay(1000);
      this.isSucessShown = false;
    }
    else {
      this.isFailShownOv = true;
      await this.delay(250);
      this.isFailShownOv = false;
      this.isFailShown = true;
      await this.delay(1000);
      this.isFailShown = false;
    }
  }

  changeEnamyImageForItem(id) {
    this.srv.GetRndEnamy(this.srv.allMap[id].item, this.pers.level, this.pers.maxPersLevel);
  }

  checkDate(date: Date) {
    let dt = new Date(date).setHours(0, 0, 0, 0);
    let now = new Date().setHours(0, 0, 0, 0);

    if (dt.valueOf() < now.valueOf()) {
      return true;
    }

    return false;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async done(t: Task) {
    await this.animate(true);

    this.changeEnamyImageForItem(t.id);

    this.srv.changesBefore();

    if (t.parrentTask) {
      // Логика для навыков
      if (t.requrense != 'нет') {
        // Если все активные на сегодня выполнены
        // Находим задачу
        let task: Task;
        let abil: Ability;
        ({ task, abil } = this.srv.findTaskAnAb(t.parrentTask, task, abil));

        // Находим нужный стайт
        for (let i = 0; i < task.states.length; i++) {
          const element = task.states[i];
          if (element.id === t.id) {
            element.isDone = true;
            this.srv.savePers(true);
          }
        }

        if (task.states.filter(n => {
          return n.isActive && !n.isDone
        }).length === 0) {
          this.srv.taskPlus(t.parrentTask);
        }
      }
      // Логика для подзадач
      else {
        this.srv.allMap[t.id].item.isDone = true;
        this.srv.savePers(true);
      }
    }
    else {
      this.srv.taskPlus(t.id);
    }
    this.srv.changesAfter(true);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.pers.tasks, event.previousIndex, event.currentIndex);
  }

  editCansel() {
    this.setGlobalTaskView(true);
    this.firstOrGlobal();
  }

  async fail(t: Task) {
    await this.animate(false);

    this.changeEnamyImageForItem(t.id);

    this.srv.changesBefore();

    if (t.parrentTask) {
      this.srv.taskMinus(t.parrentTask);
    }
    else {
      this.srv.taskMinus(t.id);
    }

    this.srv.changesAfter(false);
  }

  firstOrGlobal() {
    if (this.srv.pers$.value.currentView == curpersview.SkillTasks) {
      this.srv.pers$.value.currentView = curpersview.SkillsGlobal;
    }
    else if (this.srv.pers$.value.currentView == curpersview.SkillsSort) {
      this.srv.pers$.value.currentView = curpersview.SkillTasks;
    }
    else if (this.srv.pers$.value.currentView == curpersview.SkillsGlobal) {
      this.srv.pers$.value.currentView = curpersview.SkillTasks;
    }
    else if (this.srv.pers$.value.currentView == curpersview.QwestTasks) {
      this.srv.pers$.value.currentView = curpersview.QwestsGlobal;
    }
    else if (this.srv.pers$.value.currentView == curpersview.QwestsGlobal) {
      this.srv.pers$.value.currentView = curpersview.QwestTasks;
    }
    else if (this.srv.pers$.value.currentView == curpersview.QwestSort) {
      this.srv.pers$.value.currentView = curpersview.QwestTasks;
    }

    this.srv.savePers(false);
  }

  focusFocus() {
    if (this.pers.currentTaskIndex) {
      this.srv.setCurInd(this.pers.currentTaskIndex);
    }
    else {
      this.srv.setCurInd(0);
    }
  }

  nextTask() {
    let i = this.pers.currentTaskIndex + 1;
    if (i >= this.pers.tasks.length) {
      i = 0;
    }
    this.srv.setCurInd(i);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    this.srv.pers$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(n =>
        this.pers = n);
    if (!this.pers) {
      this.route.data.pipe(take(1))
        .subscribe(routeData => {
          let data = routeData['data'];
          if (!this.srv.isOffline) {
            // Оналайн
            if (data) {
              this.srv.user = data;
              // Пользователь пустой
              if (!this.srv.user || !this.srv.user.id) {
                this.router.navigate(['/login']);
              }
              else {
                this.srv.loadPers(this.srv.user.id)
                  .pipe(takeUntil(this.unsubscribe$))
                  .subscribe(prsInDb => {
                    // Если перс есть
                    if (prsInDb) {
                      this.srv.setPers(prsInDb);
                    }
                    // Если перса пока что не было
                    else if (!prsInDb) {
                      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                        panelClass: 'custom-black'
                      });

                      dialogRef.afterClosed().subscribe(result => {
                        if (result) {
                          this.srv.setNewPers(this.srv.user.id);
                        }
                      });
                    }
                  });
              }
            }
          }
          else {
            // Оффлайн
            let prs = JSON.parse(data);
            if (prs) {
              this.srv.setPers(data);
            }
            else {
              // Сбрасывем оффлайн
              localStorage.setItem("isOffline", JSON.stringify(false));
              localStorage.setItem("pers", JSON.stringify(null));
            }
          }
        });
    }
  }

  onLongPress(e) {
    this.srv.setCurInd(0);
  }

  onSwipeLeft(ev) {
    this.prevTask();
  }

  onSwipeRight(ev) {
    this.nextTask();
  }

  onTimeChanged(ev, tskid) {
    this.srv.allMap[tskid].item.time = ev;

    this.srv.savePers(false);
  }

  openPersList() {
    this.srvSt.selTabPersList = 0;
  }

  openPlusType(linkId, linkType) {
    if (linkType == 'qwestTask') {
      this.srv.pers$.value.currentQwestId = linkId;
      this.srv.pers$.value.currentView = curpersview.QwestTasks;
      this.srv.savePers(false);
    }
    else if (linkType == 'abTask') {
      this.srv.pers$.value.currentQwestId = null;
      this.srv.pers$.value.currentView = curpersview.SkillTasks;
      this.srv.savePers(false);
      let idx = this.pers.tasks.findIndex(n => n.plusToNames.filter(q => q.linkId == linkId).length > 0);
      this.srv.setCurInd(idx);
    }
  }

  prevTask() {
    let i = this.pers.currentTaskIndex - 1;
    if (i < 0) {
      i = this.pers.tasks.length - 1;
    }
    this.srv.setCurInd(i);
  }

  setGlobalTaskView(b: boolean) {
    this.srv.saveGlobalTaskViewState(b);
  }

  /**
   * Задаем ордер для "подзадачи" из статусов.
   * @param tskId 
   * @param stateId 
   * @param idx 
   */
  setIndForState(tskId: string, stateId: any, idx: number) {
    // Находим задачу
    let task: Task;
    let abil: Ability;
    ({ task, abil } = this.srv.findTaskAnAb(tskId, task, abil));

    if (task) {
      for (let i = 0; i < task.states.length; i++) {
        const st = task.states[i];
        if (st.id === stateId) {
          task.states[i].order = idx;
        }
      }
    }
  }

  setSort() {
    if (this.srv.pers$.value.currentView == curpersview.QwestTasks) {
      this.srv.pers$.value.currentView = curpersview.QwestSort;
    }
    else if (this.srv.pers$.value.currentView == curpersview.QwestSort) {
      let qwest: Qwest = this.srv.allMap[this.srv.pers$.value.currentQwestId].item;
      for (let index = 0; index < this.pers.tasks.length; index++) {
        this.pers.tasks[index].order = index;
      }
      qwest.tasks.sort((a, b) => a.order - b.order);

      this.srv.pers$.value.currentView = curpersview.QwestTasks;
    }
    else if (this.srv.pers$.value.currentView == curpersview.SkillTasks) {
      this.srv.pers$.value.currentView = curpersview.SkillsSort;
    }
    else if (this.srv.pers$.value.currentView == curpersview.SkillsSort) {
      this.srv.pers$.value.currentView = curpersview.SkillTasks;
    }

    this.srv.savePers(false);
  }

  /**
   * Задать вид - задачи, квесты.
   * @param name Название вида.
   */
  setView() {
    if (this.srv.pers$.value.currentView == curpersview.SkillTasks || this.srv.pers$.value.currentView == curpersview.SkillsGlobal) {
      this.srv.pers$.value.currentView = curpersview.QwestTasks;
    }
    else if (this.srv.pers$.value.currentView == curpersview.QwestTasks || this.srv.pers$.value.currentView == curpersview.QwestsGlobal) {
      this.srv.pers$.value.currentQwestId = null;
      this.srv.pers$.value.currentView = curpersview.SkillTasks;
    }

    this.srv.savePers(false);
  }

  taskToEnd(tsk: Task) {
    this.srv.setTaskOrder(tsk, true, true);
    this.srv.setCurInd(0);
    this.srv.savePers(false);
  }

  tskClick(i) {
    if (this.srv.pers$.value.currentView != curpersview.SkillsSort && this.srv.pers$.value.currentView != curpersview.QwestSort) {
      this.srv.setCurInd(i);
      if (this.srv.pers$.value.currentView == curpersview.SkillsGlobal) {
        this.srv.pers$.value.currentView = curpersview.SkillTasks;
      }
      else if (this.srv.pers$.value.currentView == curpersview.QwestsGlobal) {
        this.srv.pers$.value.currentView = curpersview.QwestTasks;
      }
      this.srv.savePers(false);
    }
  }
}
