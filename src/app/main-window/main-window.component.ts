import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.css']
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

  constructor(private route: ActivatedRoute, public srv: PersService, public dialog: MatDialog, private srvSt: StatesService, private router: Router) {
  }



  ReImages() {
    this.srv.reImages();
  }

  changeEnamyImageForItem(id) {
    // Ищем в задачах
    for (const ch of this.srv.pers.characteristics) {
      for (const ab of ch.abilities) {
        for (const tsk of ab.tasks) {
          if (tsk.id == id) {
            this.srv.GetRndEnamy(tsk);

            return;
          }
          for (let st of tsk.states) {
            if (st.id == id) {
              this.srv.GetRndEnamy(st);

              return;
            }
          }
        }
      }
    }

    // Ищем в квестах
    for (let qw of this.srv.pers.qwests) {
      for (let tsk of qw.tasks) {
        if (tsk.id == id) {
          this.srv.GetRndEnamy(tsk);

          return;
        }
        for (let st of tsk.states) {
          if (st.id == id) {
            this.srv.GetRndEnamy(st);

            return;
          }
        }
      }
    }
  }

  checkDate(date: Date) {
    let dt = new Date(date).setHours(0, 0, 0, 0);
    let now = new Date().setHours(0, 0, 0, 0);

    if (dt.valueOf() < now.valueOf()) {
      return true;
    }

    return false;
  }

  async compareTask(a: number, b: number, tasks: Task[]): Promise<boolean> {
    const aTask = tasks[a];
    const bTask = tasks[b];

    let aName = aTask.tittle;
    let bName = bTask.tittle;

    let qVal = this.qwickSortVals.find(n => n.first == aTask.id && n.second == bTask.id);
    if (qVal == undefined) {
      if (aName == bName) {
        this.qwickSortVals.push(new sortArr(aTask.id, bTask.id, 0));
        this.qwickSortVals.push(new sortArr(bTask.id, aTask.id, 0));
      }
      else {
        let result;
        result = await this.openDialog(aTask, bTask);

        if (result == true) {
          this.qwickSortVals.push(new sortArr(aTask.id, bTask.id, -1));
          this.qwickSortVals.push(new sortArr(bTask.id, aTask.id, 1));
        }
        else {
          this.qwickSortVals.push(new sortArr(aTask.id, bTask.id, 1));
          this.qwickSortVals.push(new sortArr(bTask.id, aTask.id, -1));
        }
      }
    }
    else {
    }

    qVal = this.qwickSortVals.find(n => n.first == aTask.id && n.second == bTask.id);

    if (qVal.val == -1) {
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
        for (const qw of this.srv.pers.qwests) {
          for (const tsk of qw.tasks) {
            for (const st of tsk.states) {
              if (st.id === t.id) {
                st.isDone = true;
                this.srv.savePers(true);
                break;
              }
            }
          }
        }
      }
    }
    else {
      this.srv.taskPlus(t.id);
    }
    this.srv.changesAfter(true);

    if (this.srv.pers.sellectedView == 'квесты') {
      this.srv.getQwestTasks();
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.srv.pers.tasks, event.previousIndex, event.currentIndex);
  }

  editDiaryItem() {
    if (this.srv.pers.isNoDiary == true) {
      return;
    }

    if (!this.srv.pers.Diary || this.srv.pers.Diary.length == 0) {
      return;
    }

    this.srv.isDialogOpen = true;
    let dialogRef = this.dialog.open(DiaryEditParamsComponent, {
      backdropClass: 'backdrop',
      panelClass: 'par-dialog',
      data: this.srv.pers.Diary[0]
    });

    dialogRef.afterClosed().subscribe(n => {
      this.srv.savePers(false);
      this.srv.isDialogOpen = false;
    });
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

    if (this.srv.pers.sellectedView == 'квесты') {
      this.srv.getQwestTasks();
    }
  }

  editCansel() {
    this.setGlobalTaskView(true);
    this.firstOrGlobal();
  }

  firstOrGlobal() {
    if (this.srv.isGlobalTaskView == true) {
      if (this.srv.pers.sellectedView == 'квесты') {
        this.srv.getQwestTasks();
      }
      else {
        let tasks: Task[] = this.srv.getPersTasks();
        this.srv.sortPersTasks(tasks);
      }
      this.focusFocus();
    }
    else {
      this.setGlobalTaskView(true);
      this.isSort = false;
      let tasks: Task[] = this.srv.getPersTasks();
      this.srv.sortPersTasks(tasks);
    }

    this.isSort = false;
  }

  focusFocus() {
    this.setGlobalTaskView(false);
    if (this.srv.pers.currentTaskIndex) {
      this.srv.setCurInd(this.srv.pers.currentTaskIndex);
    }
    else {
      this.srv.setCurInd(0);
    }
  }

  getDateString(dt: Date) {
    if (dt === undefined || dt === null) {
      return "";
    }
    let date = new Date(dt);

    let dateTask = moment(dt);
    let yesteday = moment(new Date()).add(-1, 'd');
    if (dateTask.isSame(yesteday, 'date')) {
      return 'Вчера';
    }
    if (dateTask.isSame(yesteday.add(-1, 'day'), 'date')) {
      return 'Позавчера';
    }

    return date.toLocaleDateString([], { day: 'numeric', month: 'numeric' }); // + ' | ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  getDifference(a, b) {
    if (a.length > b.length) {
      let c = b;
      b = a;
      a = c;
    }

    let i = 0;
    let j = 0;
    let result = "";

    while (j < b.length) {
      if (a[i] != b[j] || i == a.length)
        result += b[j];
      else
        i++;
      j++;
    }

    if (result.startsWith(';')) {
      result = result.substr(1);
    }

    return result;
  }

  getFullTaskDescr(t: Task): any {
    let task;
    let abil: Ability;

    if (t.parrentTask) {
      ({ task, abil } = this.srv.findTaskAnAb(t.parrentTask, task, abil));
    }
    else {
      ({ task, abil } = this.srv.findTaskAnAb(t.id, task, abil));
    }

    if (task) {
      return { tittle: task.tittle, isSumStates: task.isSumStates };
    }
    else {
      return '';
    }
  }

  getNameVal(aName: string): number {
    const lower = aName.toLocaleLowerCase();
    if (lower.match(/(утро|завтрак|утром|утра)/)) {
      return 1;
    }
    if (lower.match(/(день|днем|обед)/)) {
      return 2;
    }
    if (lower.match(/(вечер|вечером|ужин)/)) {
      return 3;
    }
    if (lower.match(/(сном)/)) {
      return 4;
    }

    return -1
  }

  nextTask() {
    let i = this.srv.pers.currentTaskIndex + 1;
    if (i >= this.srv.pers.tasks.length) {
      i = 0;
    }
    this.srv.setCurInd(i);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    if (!this.srv.pers) {
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
                      if (confirm("Вы готовы начать новую игру?")) {
                        const pers = new Pers();
                        pers.userId = this.srv.user.id;
                        pers.id = this.srv.user.id;
                        pers.level = 0;
                        pers.prevExp = 0;
                        pers.nextExp = 0;

                        this.srv.setPers(pers);
                      }
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

  // onImgErr() {
  //   let id = this.srv.pers.currentTask.id;
  //   this.changeEnamyImageForItem(id);
  //   this.srv.savePers(false);
  // }
  onLongPress(e) {
    // e.preventDefault && e.preventDefault();
    // e.stopPropagation && e.stopPropagation();
    // e.cancelBubble = true;
    // e.returnValue = false;

    this.srv.setCurInd(0);
  }

  onSwipeLeft(ev) {
    this.prevTask();
  }

  onSwipeRight(ev) {
    this.nextTask();
  }

  async setTime(tsk: Task, noOld = false): Promise<number> {
    // let aval = this.getNameVal(tsk.tittle);

    // if (aval != -1) {
    //   return Promise.resolve(aval);
    // }

    // if (!tsk.timeVal) {
    //   tsk.timeVal = -1;
    // }

    if (noOld == false) {
      if (tsk.timeVal && tsk.timeVal >= 1) {
        return Promise.resolve(tsk.timeVal);
      }
    }

    const dialogRef = this.dialog.open(TskTimeValDialogComponent, {
      data: { name: tsk.tittle, timeVal: tsk.timeVal },
      width: '800px'
    });

    return dialogRef.afterClosed()
      .toPromise() // here you have a Promise instead an Observable
      .then(result => {
        return Promise.resolve(result); // will return a Promise here
      });
  }

  async openDialog(aTask: Task, bTask: Task): Promise<boolean> {
    let aval = aTask.timeVal;
    let bval = bTask.timeVal;

    if (aval != -1 && bval != -1) {
      if (aval < bval) {
        return Promise.resolve(true);
      }
      if (aval > bval) {
        return Promise.resolve(false);
      }
    }

    const dialogRef = this.dialog.open(ArrSortDialogComponent, {
      data: { aName: aTask.tittle, bName: bTask.tittle },
      width: '800px'
    });

    return dialogRef.afterClosed()
      .toPromise() // here you have a Promise instead an Observable
      .then(result => {
        return Promise.resolve(result); // will return a Promise here
      });
  }

  openPersList() {
    this.srvSt.selTabPersList = 0;
  }

  prevTask() {
    let i = this.srv.pers.currentTaskIndex - 1;
    if (i < 0) {
      i = this.srv.pers.tasks.length - 1;
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

  addToQwest() {
    let qwest = this.srv.pers.qwests.find(n => n.id == this.srv.pers.currentQwestId)

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
            this.srv.pers.tasks = qwest.tasks.filter(n => !n.isDone);
          }
        });
    }
  }

  openPlusType(linkId, linkType) {
    if (linkType == 'qwestTask') {
      this.srv.setView('квесты');
      this.setGlobalTaskView(false);
      this.srv.pers.currentQwestId = linkId;
      this.srv.getQwestTasks();
    }
    else if (linkType == 'abTask') {
      this.srv.pers.currentQwestId = null;
      this.srv.setView('навыки');
      this.setGlobalTaskView(false);
      let idx = this.srv.pers.tasks.findIndex(n => n.plusToNames.filter(q => q.linkId == linkId).length > 0);
      this.srv.setCurInd(idx);
    }
  }

  setSort() {
    if (this.isSort) {
      if (this.srv.pers.sellectedView === 'квесты') {
        let qwest = this.srv.pers.qwests.find(n => n.id == this.srv.pers.currentQwestId)
        if (qwest) {
          for (let index = 0; index < this.srv.pers.tasks.length; index++) {
            this.srv.pers.tasks[index].order = index;
          }
          qwest.tasks.sort((a, b) => a.order - b.order);
          this.srv.getQwestTasks();
        }
      }
      else {
        for (let index = 0; index < this.srv.pers.tasks.length; index++) {
          if (this.srv.pers.tasks[index].parrentTask) {
            this.setIndForState(this.srv.pers.tasks[index].parrentTask, this.srv.pers.tasks[index].id, index);
          }
          else {
            this.srv.pers.tasks[index].order = index;
          }
        }
      }

      this.setGlobalTaskView(this.lastGlobalBeforeSort);
      this.srv.savePers(false);
    }
    else {
      this.lastGlobalBeforeSort = this.srv.isGlobalTaskView;
      this.setGlobalTaskView(true);
      if (this.srv.pers.sellectedView === 'квесты') {
        this.srv.getQwestTasks(true);
      }
      else {
        this.srv.getAllAbTasks();
      }
    }

    this.isSort = !this.isSort;
  }



  /**
   * Задать вид - задачи, квесты.
   * @param name Название вида.
   */
  setView() {
    if (this.srv.pers.sellectedView === 'квесты') {
      this.setGlobalTaskView(false);
      this.srv.pers.currentQwestId = null;
      this.srv.setView('навыки');
    }
    else {
      this.setGlobalTaskView(true);
      this.srv.setView('квесты');
    }
  }

  async setTimes() {
    for (let i = 0; i < this.srv.pers.tasks.length; i++) {
      let tsk = this.srv.pers.tasks[i];
      let timeVal = await this.setTime(tsk, true);
      tsk.timeVal = timeVal;

      for (const ch of this.srv.pers.characteristics) {
        for (const ab of ch.abilities) {
          for (const t of ab.tasks) {
            if (t.id == tsk.id) {
              t.timeVal = timeVal;
              break;
            }
            for (const st of t.states) {
              if (st.id == tsk.id) {
                st.timeVal = timeVal;
                break;
              }
            }
          }
        }
      }

    }
  }

  async smartSort() {
    const tLength = this.srv.pers.tasks.length;
    this.qwickSortVals = [];

    await this.setTaskTime(this.srv.pers.tasks);
    this.srv.pers.tasks = await this.quickSort2(this.srv.pers.tasks);
  }

  async setTaskTime(arr: Task[]) {
    for (let i = 0; i < arr.length; i++) {
      const tsk = arr[i];
      let timeVal = await this.setTime(tsk);
      tsk.timeVal = timeVal;

      for (const ch of this.srv.pers.characteristics) {
        for (const ab of ch.abilities) {
          for (const t of ab.tasks) {
            if (t.id == tsk.id) {
              t.timeVal = timeVal;
              break;
            }
            for (const st of t.states) {
              if (st.id == tsk.id) {
                st.timeVal = timeVal;
                break;
              }
            }
          }
        }
      }
    }
  }

  async quickSort2(arr: Task[]) {
    if (arr.length < 2) return arr;
    let min = 1;
    let max = arr.length - 1;
    let rand = Math.floor((min + max) / 2);
    let pivot = arr[rand];
    const left = [];
    const right = [];
    arr.splice(arr.indexOf(pivot), 1);
    arr = [pivot].concat(arr);

    for (let i = 1; i < arr.length; i++) {
      //if (pivot > arr[i]) {
      let res = await this.compareTask(i, 0, arr);
      if (res == true) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }

    let leftArr = await this.quickSort2(left);
    let rightArr = await this.quickSort2(right);

    return Promise.resolve(leftArr.concat(pivot, rightArr));
  }

  taskToEnd(tsk: Task) {
    this.srv.setTaskOrder(tsk, true, true);
    this.srv.setCurInd(0);
    this.srv.savePers(false);
  }

  tmp() {
    let dialogRefLvlUp = this.dialog.open(LevelUpMsgComponent, {
      panelClass: 'my-good',
      backdropClass: 'backdrop'
    });
  }

  tskClick(i) {
    if (!this.isSort) {
      this.setGlobalTaskView(false);
      this.srv.setCurInd(i);
      if (this.srv.pers.sellectedView == 'квесты') {
        this.srv.getQwestTasks();
      }
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
}
