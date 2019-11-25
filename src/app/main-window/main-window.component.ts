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

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.css']
})
export class MainWindowComponent implements OnInit {
  private unsubscribe$ = new Subject();

  isSort: boolean = false;
  lastGlobalBeforeSort: boolean;

  constructor(private route: ActivatedRoute, public srv: PersService) {
  }

  onLongPress(e){
    // e.preventDefault && e.preventDefault();
    // e.stopPropagation && e.stopPropagation();
    // e.cancelBubble = true;
    // e.returnValue = false;

    this.setIndex(0);
  }

  getEnamyImg(){
    this.srv.checkUpdateTaskImage(this.srv.pers.currentTask);
  }

  autoFalse() {
    this.srv.pers.tasks.forEach(tsk => {
      this.srv.taskMinus(tsk.id, true);
    });
  }

  checkDate(date: Date) {
    let dt = new Date(date).setHours(0, 0, 0, 0);
    let now = new Date().setHours(0, 0, 0, 0);

    if (dt.valueOf() < now.valueOf()) {
      return true;
    }

    return false;
  }

  done(t: Task) {
    debugger;
    this.srv.changesBefore();

    if (t.parrentTask) {
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
    else {
      this.srv.taskPlus(t.id);
    }

    this.srv.changesAfter(true);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.srv.pers.tasks, event.previousIndex, event.currentIndex);
  }

  fail(t: Task) {
    this.srv.changesBefore();

    if (t.parrentTask) {
      this.srv.taskMinus(t.parrentTask);
    }
    else {
      this.srv.taskMinus(t.id);
    }

    this.srv.changesAfter(false);
  }

  onSwipeLeft(ev) {
    this.prevTask();
  }

  onSwipeRight(ev) {
    this.nextTask();
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

  tskClick(i) {
    if (!this.isSort) {
      this.setIndex(i);
      this.setGlobalTaskView(false);
    }
  }
}
