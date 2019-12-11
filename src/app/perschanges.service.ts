import { Injectable } from '@angular/core';
import { Pers } from 'src/Models/Pers';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersChangesComponent } from './pers-changes/pers-changes.component';
import { MatDialog } from '@angular/material/dialog';
import { Ability } from 'src/Models/Ability';
import { PersService } from './pers.service';
import { Router } from '@angular/router';
import { Task } from 'src/Models/Task';
import { ChangesModel } from 'src/Models/ChangesModel';
import { Characteristic } from 'src/Models/Characteristic';


@Injectable({
  providedIn: 'root'
})
export class PerschangesService {
  afterPers: Pers;
  beforePers: Pers;

  constructor(private _snackBar: MatSnackBar, public dialog: MatDialog, private router: Router) { }

  getClone(pers: Pers): Pers {
    return JSON.parse(JSON.stringify(pers));
  }

  showChanges(congrantMsg: string, failMsg: string, isGood: boolean) {
    let changesMap = {};

    // Значения до
    this.fillChangesMap(changesMap, 'before', this.beforePers);
    // Значения после
    this.fillChangesMap(changesMap, 'after', this.afterPers);

    // Ищем изменения
    let changes: ChangesModel[] = [];

    // Показать настройку навыка
    let abToEdit: any = null;

    Object.keys(changesMap).forEach(n => {

      // Подзадачи
      if (changesMap[n].type == 'tsk') {
        // Прогрес в стейтах
        if (changesMap[n].tskProgrBefore != changesMap[n].tskProgrAfter
          && changesMap[n].tskProgrAfter != 0) {
          changes.push(
            new ChangesModel(changesMap[n].name, 'subtask', changesMap[n].tskProgrBefore, changesMap[n].tskProgrAfter, 0, changesMap[n].tskProgrTotal)
          );
        }
      }
      // Квесты
      if (changesMap[n].type == 'qwest') {
        if (changesMap[n].after === null || changesMap[n].after === undefined) {
          // changes.push(
          //   new ChangesModel(changesMap[n].name, 'qwestDone', null, null, null, null)
          // );
        }
        else if (changesMap[n].after > changesMap[n].before) {
          changes.push(
            new ChangesModel(changesMap[n].name, 'qwest', changesMap[n].before, changesMap[n].after, 0, changesMap[n].total)
          );
        }
      }
      // Награды
      else if (changesMap[n].type == 'inv') {
        if (changesMap[n].after === null || changesMap[n].after === undefined) {
          changes.push(
            new ChangesModel(changesMap[n].name, 'inv', 1, 0, 0, 0)
          );
        }
        else if (changesMap[n].before === null || changesMap[n].before === undefined) {
          changes.push(
            new ChangesModel(changesMap[n].name, 'inv', 0, 1, 0, 1)
          );
        }
        else if (changesMap[n].after > changesMap[n].before) {
          changes.push(
            new ChangesModel(changesMap[n].name, 'inv', changesMap[n].before, changesMap[n].after, 0, changesMap[n].after)
          );
        }
        else if (changesMap[n].after < changesMap[n].before) {
          changes.push(
            new ChangesModel(changesMap[n].name, 'inv', changesMap[n].before, changesMap[n].after, 0, changesMap[n].after)
          );
        }
      }
      // Характеристики
      else if (changesMap[n].type == 'cha') {
        if (changesMap[n].after != changesMap[n].before) {
          changes.push(
            new ChangesModel(changesMap[n].name, 'cha', changesMap[n].before, changesMap[n].after, 0, Characteristic.maxValue)
          );
        }
      }
      // Навыки
      else if (changesMap[n].type == 'abil') {
        if (changesMap[n].after != changesMap[n].before) {
          changes.push(
            new ChangesModel(changesMap[n].name, 'abil', changesMap[n].before, changesMap[n].after, 0, Ability.maxValue)
          );

          if (changesMap[n].after == 1) {
            abToEdit = n;
          }
        }
        // Прогрес в стейтах
        else if (changesMap[n].tskProgrBefore != changesMap[n].tskProgrAfter
          && changesMap[n].tskProgrAfter != 0) {
          changes.push(
            new ChangesModel(changesMap[n].name, 'state', changesMap[n].tskProgrBefore, changesMap[n].tskProgrAfter, 0, changesMap[n].tskProgrTotal)
          );
        }
      }
      // Опыт
      else if (changesMap[n].type == 'exp') {
        if (changesMap[n].after > changesMap[n].before) {
          changes.push(
            new ChangesModel('Опыт', 'exp', changesMap[n].before * 10, changesMap[n].after * 10, this.afterPers.prevExp * 10, this.afterPers.nextExp * 10)
          );
        }
        else if (changesMap[n].after < changesMap[n].before) {
          changes.push(
            new ChangesModel('Опыт', 'exp', changesMap[n].before * 10, changesMap[n].after * 10, this.afterPers.prevExp * 10, this.afterPers.nextExp * 10)
          );
        }
      }
      // Уровень
      else if (changesMap[n].type == 'lvl') {
        if (changesMap[n].after > changesMap[n].before) {
          // changes.push(
          //   new ChangesModel('Уровень', 'lvl', changesMap[n].before, changesMap[n].after, 0, Pers.maxLevel)
          // );
        }
        else if (changesMap[n].after > changesMap[n].before) {
          // changes.push(
          //   new ChangesModel('Уровень', 'lvl', changesMap[n].before, changesMap[n].after, 0, Pers.maxLevel)
          // );
        }
      }
      // Ранг
      else if (changesMap[n].type == 'rang') {
        if (changesMap[n].after > changesMap[n].before) {
          // changes.push(
          //   new ChangesModel('Ранг', 'rang', changesMap[n].before, changesMap[n].after, 0, Pers.rangLvls.length)
          // );
        }
        else if (changesMap[n].after > changesMap[n].before) {
          // changes.push(
          //   new ChangesModel('Ранг', 'rang', changesMap[n].before, changesMap[n].after, 0, Pers.rangLvls.length)
          // );
        }
      }
    });

    let head = '';

    if (isGood == null) {
      head = null;
      isGood = true;
    }
    else {
      if (isGood) {
        head = congrantMsg;
      }
      else {
        head = failMsg;
      }
    }

    let classPanel = isGood ? 'my-good' : 'my-bad';

    let dialogRef = this.dialog.open(PersChangesComponent, {
      panelClass: classPanel,
      data: {
        headText: head,
        changes: changes,
        isGood: isGood
      },
      backdropClass: 'backdrop'
      //hasBackdrop: false
    });

    setTimeout(() => {
      dialogRef.close();
      if (abToEdit != null) {
        this.router.navigate(['/task', abToEdit, false]);
      }
    }, 4500);
  }

  private fillChangesMap(changesMap: {}, chType: string, prs: Pers) {
    // Ранг
    if (!changesMap['rang']) {
      changesMap['rang'] = this.getChItem('rang', 'rang');
    }
    changesMap['rang'][chType] = prs.rang.name;

    // Уровень
    if (!changesMap['lvl']) {
      changesMap['lvl'] = this.getChItem('lvl', 'lvl');
    }
    changesMap['lvl'][chType] = prs.level;

    // Опыт
    if (!changesMap['exp']) {
      changesMap['exp'] = this.getChItem('exp', 'exp');
    }
    changesMap['exp'][chType] = prs.exp;

    // Характеристики
    prs.characteristics.forEach(ch => {
      if (!changesMap[ch.id]) {
        changesMap[ch.id] = this.getChItem('cha', ch.name);
      }
      changesMap[ch.id][chType] = Math.floor(ch.value);
    });

    // Навыки
    prs.characteristics.forEach(ch => {
      ch.abilities.forEach(ab => {
        ab.tasks.forEach(tsk => {
          if (!changesMap[tsk.id]) {
            changesMap[tsk.id] = this.getChItem('abil', ab.name);
          }

          changesMap[tsk.id][chType] = Math.floor(tsk.value);

          if (tsk.isSumStates) {
            this.tskStatesProgress(tsk, chType, changesMap, true);
          }

        });
      });
    });

    // Квесты
    prs.qwests.forEach(qw => {
      if (!changesMap[qw.id]) {
        let qwitem = this.getChItem('qwest', qw.name);
        changesMap[qw.id] = qwitem;
      }

      changesMap[qw.id][chType] = qw.tasks.filter(n => n.isDone).length;
      changesMap[qw.id]['total'] = qw.tasks.length;

      // Подзадачи
      qw.tasks.forEach(tsk => {
        if (!changesMap[tsk.id]) {
          let qwitem = this.getChItem('tsk', tsk.name);
          changesMap[tsk.id] = qwitem;
        }
        this.tskStatesProgress(tsk, chType, changesMap, false);
      });
    });

    // Инвентарь
    prs.inventory.forEach(inv => {
      if (!changesMap[inv.id]) {
        changesMap[inv.id] = this.getChItem('inv', inv.name);
      }

      changesMap[inv.id][chType] = inv.count;
    });
  }

  private tskStatesProgress(tsk: Task, chType: string, changesMap: any, isCheckActive: boolean) {
    if (tsk.states.length > 0) {
      let done = tsk.states.filter(n => (n.isActive || !isCheckActive) && n.isDone).length;
      if (chType == 'before') {
        changesMap[tsk.id]['tskProgrBefore'] = done;
      }
      else {
        changesMap[tsk.id]['tskProgrAfter'] = done;
      }
      let all = tsk.states.filter(n => (n.isActive || !isCheckActive)).length;
      changesMap[tsk.id]['tskProgrTotal'] = all;
    }
    else {
      changesMap[tsk.id]['tskProgrBefore'] = 1;
      changesMap[tsk.id]['tskProgrAfter'] = 1;
      changesMap[tsk.id]['tskProgrTotal'] = 1;
    }
  }

  private getChItem(type, name): any {
    let ch = new changesItem();
    ch.type = type;
    ch.name = name;

    return ch;
  }
}

export class changesItem {
  before;
  after;
  type;
  img;
  total;
  name;
  tskProgrBefore;
  tskProgrAfter;
  tskProgrTotal;
}
