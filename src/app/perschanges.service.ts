import { Injectable } from '@angular/core';
import { Pers } from 'src/Models/Pers';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersChangesComponent } from './pers-changes/pers-changes.component';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root'
})
export class PerschangesService {
  afterPers: Pers;
  beforePers: Pers;

  constructor(private _snackBar: MatSnackBar, public dialog: MatDialog) { }

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
    let changes: string[] = [];

    Object.keys(changesMap).forEach(n => {
      // Квесты
      if (changesMap[n].type == 'qwest') {
        if (changesMap[n].after === null || changesMap[n].after === undefined) {
          changes.push('' + changesMap[n].name + ' выполнен');
        }
        else if (changesMap[n].after > changesMap[n].before) {
          if (changesMap[n].after == changesMap[n].total) {
            changes.push('Миссии квеста ' + changesMap[n].name + ' выполнены!!!');
          }
          else {
            changes.push('' + changesMap[n].name + ' ' + changesMap[n].after + '/' + changesMap[n].total);
          }
        }
      }
      // Награды
      else if (changesMap[n].type == 'inv') {
        if (changesMap[n].after === null || changesMap[n].after === undefined) {
          changes.push('' + changesMap[n].name + ' использован');
        }
        else if (changesMap[n].before === null || changesMap[n].before === undefined) {
          changes.push('' + changesMap[n].name + ' получен');
        }
        else if (changesMap[n].after > changesMap[n].before) {
          changes.push('' + changesMap[n].name + ' получен');
        }
        else if (changesMap[n].after < changesMap[n].before) {
          changes.push('' + changesMap[n].name + ' использован');
        }
      }
      // Характеристики
      else if (changesMap[n].type == 'cha') {
        if (changesMap[n].after != changesMap[n].before) {
          changes.push('' + changesMap[n].name + ' ' + changesMap[n].after);
        }
      }
      // Навыки
      else if (changesMap[n].type == 'abil') {
        if (changesMap[n].after != changesMap[n].before) {
          changes.push('' + changesMap[n].name + ' ' + changesMap[n].after);
        }
        // Прогрес в стейтах
        else if (changesMap[n].tskProgrBefore != changesMap[n].tskProgrAfter
          && changesMap[n].tskProgrAfter != 0) {
          changes.push('' + changesMap[n].name + ' ' + changesMap[n].tskProgrAfter + '/' + changesMap[n].tskProgrTotal);
        }
      }
      // Опыт
      else if (changesMap[n].type == 'exp') {
        if (changesMap[n].after > changesMap[n].before) {
          let chExp = Math.floor((changesMap[n].after - changesMap[n].before) * 10.0);

          changes.push('Опыт +' + chExp);
        }
        else if (changesMap[n].after < changesMap[n].before) {
          let chExp = Math.floor((changesMap[n].before - changesMap[n].after) * 10.0);

          changes.push('Опыт -' + chExp);
        }
      }
      // Уровень
      else if (changesMap[n].type == 'lvl') {
        if (changesMap[n].after > changesMap[n].before) {
          changes.push('Новый уровень!');
        }
        else if (changesMap[n].after > changesMap[n].before) {
          changes.push('Уровень понижен!');
        }
      }
      // Ранг
      else if (changesMap[n].type == 'rang') {
        if (changesMap[n].after > changesMap[n].before) {
          changes.push('Новый ранг: ' + changesMap[n].after);
        }
        else if (changesMap[n].after > changesMap[n].before) {
          changes.push('Ранг понижен: ' + changesMap[n].after);
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

    // this._snackBar.openFromComponent(PersChangesComponent, {
    //   duration: 2000,
    //   data: {
    //     headText: head,
    //     changes: changes,
    //     isGood: isGood
    //   },
    //   verticalPosition: 'top',
    //   horizontalPosition: 'center',
    //   panelClass: [classPanel]
    // });

    let dialogRef = this.dialog.open(PersChangesComponent, {
      panelClass: classPanel,
      data: {
        headText: head,
        changes: changes,
        isGood: isGood
      },
      hasBackdrop: false
    });

    setTimeout(()=>{
      dialogRef.close();
    }, 3000);
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

          if (tsk.isSumStates && tsk.states.length > 0) {
            let done = tsk.states.filter(n => n.isActive && n.isDone).length;

            if (chType == 'before') {
              changesMap[tsk.id]['tskProgrBefore'] = done;
            }
            else {
              changesMap[tsk.id]['tskProgrAfter'] = done;
            }

            let all = tsk.states.filter(n => n.isActive).length;
            changesMap[tsk.id]['tskProgrTotal'] = all;
          }
          else {
            changesMap[tsk.id]['tskProgrBefore'] = 1;
            changesMap[tsk.id]['tskProgrAfter'] = 1;
            changesMap[tsk.id]['tskProgrTotal'] = 1;
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
    });

    // Инвентарь
    prs.inventory.forEach(inv => {
      if (!changesMap[inv.id]) {
        changesMap[inv.id] = this.getChItem('inv', inv.name);
      }

      changesMap[inv.id][chType] = inv.count;
    });
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
