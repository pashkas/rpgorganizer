import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.css']
})
export class MainWindowComponent implements OnInit {
  private unsubscribe$ = new Subject();

  isSort: boolean = false;
  lastGlobalBeforeSort: boolean;

  isSucessShown = false;
  isFailShown = false;

  constructor(private route: ActivatedRoute, public srv: PersService, public dialog: MatDialog) {
  }

  ReImages() {
    this.srv.reImages();
  }

  qwickSortVals: sortArr[] = [];

  async smartSort() {
    const tLength = this.srv.pers.tasks.length;
    this.qwickSortVals = [];

    this.srv.pers.tasks = await this.quickSort2(this.srv.pers.tasks);
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

  async openDialog(aName, bName): Promise<boolean> {
    let aval = this.getNameVal(aName);
    let bval = this.getNameVal(bName);

    if (aval != -1 && bval != -1) {
      if (aval < bval) {
        return Promise.resolve(true);
      }
      if (aval > bval) {
        return Promise.resolve(false);
      }
    }


    const dialogRef = this.dialog.open(ArrSortDialogComponent, {
      data: { aName: aName, bName: bName },
      width: '800px'
    });

    return dialogRef.afterClosed()
      .toPromise() // here you have a Promise instead an Observable
      .then(result => {
        return Promise.resolve(result); // will return a Promise here
      });
  }
  getNameVal(aName: string): number {
    const lower = aName.toLocaleLowerCase();
    if (lower.match(/(утро|завтрак|утром|утра)/)) {
      return 1;
    }
    if (lower.match(/(день|днем|обед)/)) {
      return 2;
    }
    if (lower.match(/(вечер|вечером|ужин|сном)/)) {
      return 3;
    }

    return -1
  }

  async compareTask(a: number, b: number, tasks: Task[]): Promise<boolean> {
    const aTask = tasks[a];
    const bTask = tasks[b];

    let aName = aTask.name;
    let bName = bTask.name;

    let qVal = this.qwickSortVals.find(n => n.first == aTask.id && n.second == bTask.id);
    if (qVal == undefined) {
      if (aName == bName) {
        this.qwickSortVals.push(new sortArr(aTask.id, bTask.id, 0));
        this.qwickSortVals.push(new sortArr(bTask.id, aTask.id, 0));
      }
      else {
        let result = await this.openDialog(aName, bName);

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

  delay() {
    return new Promise(resolve => setTimeout(resolve, 333));
  }

  async done(t: Task) {

    if (this.srv.pers.isNoExpShow) {
      this.isSucessShown = true;
      await this.delay();
      this.isSucessShown = false;
    }

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
    if (this.srv.pers.isNoExpShow) {
      await this.delay();
      await this.delay();
    }
    this.srv.changesAfter(true);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.srv.pers.tasks, event.previousIndex, event.currentIndex);
  }

  editDiaryItem() {
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
    if (this.srv.pers.isNoExpShow) {
      this.isFailShown = true;
      await this.delay();
      this.isFailShown = false;
      await this.delay();
    }

    this.changeEnamyImageForItem(t.id);

    this.srv.changesBefore();

    if (t.parrentTask) {
      this.srv.taskMinus(t.parrentTask);
    }
    else {
      this.srv.taskMinus(t.id);
    }

    if (this.srv.pers.isNoExpShow) {
      await this.delay();
      await this.delay();
    }
    this.srv.changesAfter(false);
  }

  firstOrGlobal() {
    if (this.srv.isGlobalTaskView) {
      this.focusFirst();
    }
    else {
      this.setGlobalTaskView(true);
    }
  }

  focusFirst() {
    this.setGlobalTaskView(false);
    this.srv.setCurInd(0);
  }

  getDateString(dt: Date) {
    if (dt === undefined || dt === null) {
      return "";
    }
    let date = new Date(dt);
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

  nextTask() {
    let i = this.srv.pers.currentTaskIndex + 1;
    if (i >= this.srv.pers.tasks.length) {
      i = 0;
    }
    this.setIndex(i);
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
          if (data) {
            this.srv.setUser(data);
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

    this.setIndex(0);
  }

  onSwipeLeft(ev) {
    this.prevTask();
  }

  onSwipeRight(ev) {
    this.nextTask();
  }

  openPersList() {
    this.srv.selTabPersList = 0;
  }

  prevTask() {
    let i = this.srv.pers.currentTaskIndex - 1;
    if (i < 0) {
      i = this.srv.pers.tasks.length - 1;
    }
    this.setIndex(i);
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

  setIndex(i: number) {
    this.srv.setCurInd(i);
  }

  setSort() {
    if (this.isSort) {
      for (let index = 0; index < this.srv.pers.tasks.length; index++) {
        if (this.srv.pers.tasks[index].parrentTask) {
          this.setIndForState(this.srv.pers.tasks[index].parrentTask, this.srv.pers.tasks[index].id, index);
        }
        else {
          this.srv.pers.tasks[index].order = index;
        }
      }

      this.srv.savePers(false);
      this.setGlobalTaskView(this.lastGlobalBeforeSort);
    }
    else {
      this.lastGlobalBeforeSort = this.srv.isGlobalTaskView;
      this.setGlobalTaskView(true);
      this.srv.getAllAbTasks();
    }

    this.isSort = !this.isSort;
  }

  /**
   * Задать вид - задачи, квесты.
   * @param name Название вида.
   */
  setView() {
    if (this.srv.pers.sellectedView === 'квесты') {
      this.srv.setView('навыки');
    }
    else {
      this.srv.setView('квесты');
    }
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
      this.setIndex(i);
      this.setGlobalTaskView(false);
    }
  }
}
