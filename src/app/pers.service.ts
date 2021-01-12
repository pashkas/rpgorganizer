import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Pers } from 'src/Models/Pers';
import { BehaviorSubject, Subject, Observable, fromEvent, merge, Observer } from 'rxjs';
import { FirebaseUserModel } from 'src/Models/User';
import { Characteristic } from 'src/Models/Characteristic';
import { Ability } from 'src/Models/Ability';
import { Task, taskState, IImg } from 'src/Models/Task';
import { first, take, takeUntil, share, map, filter } from 'rxjs/operators';
import { Qwest } from 'src/Models/Qwest';
import { Reward } from 'src/Models/Reward';
import { plusToName } from 'src/Models/plusToName';
import { Rangse } from 'src/Models/Rangse';
import { Router } from '@angular/router';
import { PerschangesService } from './perschanges.service';
import { EnamiesService } from './enamies.service';
import { Diary, DiaryParam } from 'src/Models/Diary';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PersService {
  // Персонаж
  private unsubscribe$ = new Subject();

  baseTaskPoints: number = 1.0;
  isDialogOpen: boolean = false;
  isGlobalTaskView: boolean;
  isOffline: boolean = false;
  isOnline: boolean;
  mn1Count: number = 65;
  mn2Count: number = 149;
  mn3Count: number = 713;
  mn4Count: number = 745;
  mn5Count: number = 285;
  pers: Pers;
  // Пользователь
  user: FirebaseUserModel;
  absMap: any;

  constructor(public db: AngularFirestore, private router: Router, private changes: PerschangesService, private enmSrv: EnamiesService) {
    this.createOnline$().subscribe(isOnline => this.isOnline = isOnline);
    let isOffline = localStorage.getItem("isOffline");
    if (isOffline === 'undefined' || isOffline === 'null') {
      this.isOffline = false;
    }
    else {
      this.isOffline = JSON.parse(isOffline);
    }
  }

  /**
   * Добавить новую награду.
   */
  AddRevard(rev: Reward): any {
    this.pers.rewards.push(rev);
  }

  /**
   * Проверка и задание даты для задачи.
   * @param tsk Задача.
   */
  CheckSetTaskDate(tsk: Task): any {
    let tDate = new Date(tsk.date);

    while (true) {
      if (tsk.requrense === 'дни недели' && tsk.tskWeekDays.length === 0) {
        break;
      }

      if (this.checkDate(tDate, tsk.requrense, tsk.tskWeekDays)) {
        break;
      }

      tDate.setDate(tDate.getDate() + 1);
    }

    tsk.date = tDate;
  }

  /**
   * Удаление характеристики.
   * @param uuid Идентификатор.
   */
  DeleteCharact(uuid: any): any {
    this.pers.characteristics.splice(this.pers.characteristics.findIndex(n => n.id == uuid), 1);
  }

  /**
   * Завершить квест.
   * @param qw Идентификатор квестов.
   */
  DoneQwest(qw: Qwest): any {
    // Добавляем к персонажу награды от квеста
    qw.rewards.forEach(rew => {
      this.pers.inventory.push(rew);
    });

    // Прибавка к опыту
    if (qw.exp > 0) {
      let plusExp = qw.exp / 10.0;
      this.pers.exp += plusExp;
    }

    const qwId = qw.id;

    this.removeParrents(qwId);

    this.delQwest(qwId);

    this.savePers(true);
  }

  /**
   * У следующего квеста удаляем parrent
   * @param qwId Идентификатор родителя
   */
  private removeParrents(qwId: any) {
    for (let i = 0; i < this.pers.qwests.length; i++) {
      const qw = this.pers.qwests[i];
      if (qw.parrentId == qwId) {
        qw.parrentId = 0;
      }
    }

  }

  GetRndEnamy(tsk: IImg): string {
    let mnstrLvl = this.getMonsterLevel(this.pers.level);

    tsk.imageLvl = '' + mnstrLvl;
    tsk.image = this.getImgPathRandome(mnstrLvl);

    return;
  }

  abSorter(): (a: Ability, b: Ability) => number {
    return (a, b) => {
      return (a.value - b.value);
      //   // По требованиям
      //   if (a.isNotDoneReqvirements != b.isNotDoneReqvirements) {
      //     return (+a.isNotDoneReqvirements - +b.isNotDoneReqvirements);
      //   }

      //   if (!this.pers.isTES) {
      //     let aHasSameLvl = 0;
      //     if (a.HasSameAbLvl) {
      //       aHasSameLvl = 1;
      //     }
      //     let bHasSameLvl = 0;
      //     if (b.HasSameAbLvl) {
      //       bHasSameLvl = 1;
      //     }
      //     if (this.pers.IsAbUp) {
      //       // Если есть с такой же сложностью навыка
      //       if (aHasSameLvl != bHasSameLvl) {
      //         return -(aHasSameLvl - bHasSameLvl);
      //       }

      //       // По возможности открытия
      //       let aIsMax = a.value > 9;
      //       let bIsMax = b.value > 9;

      //       if (aIsMax != bIsMax) {
      //         return (+aIsMax - +bIsMax);
      //       }
      //     }
      //   }

      //   // По открытости
      //   // if (a.isOpen != b.isOpen) {
      //   //   return -(+a.isOpen - +b.isOpen);
      //   // }

      //   // По значению
      //   if (a.value != b.value) {
      //     return -(a.value - b.value);
      //   }

      //   return a.name.localeCompare(b.name);
    };
  }

  /**
   * Добавить навык.
   * @param charactId Идентификатор характеристики.
   */
  addAbil(charactId: string, name: string): any {
    var charact: Characteristic = this.pers.characteristics.filter(n => {
      return n.id === charactId;
    })[0];
    if (charact != null && charact != undefined) {
      var abil = new Ability();
      abil.name = name;

      if (Pers.GameSettings.isNoAbilities) {
        this.addTsk(abil, name);
      }

      charact.abilities.push(abil);
    }
  }

  /**
   * Добавление новой характеристики.
   * @param newCharact Название.
   */
  addCharact(newCharact: string): any {
    var cha = new Characteristic();
    cha.name = newCharact;
    this.pers.characteristics.push(cha);
  }

  /**
  * Добавить новый квест.
  * @param newQwest Название квеста.
  */
  addQwest(newQwest: string, parrent?: any, img?: string, abId?: any): any {
    let qwest = new Qwest();
    qwest.name = newQwest;
    if (parrent) {
      qwest.parrentId = parrent;
    }
    if (img) {
      qwest.image = img;
    }
    if (abId) {
      qwest.abilitiId = abId;
    }

    this.pers.qwests.push(qwest);
  }

  /**
   * Добавить запись в дневник.
   * @param task Задача
   * @param isDone Выполнена?
   */
  addToDiary(task: Task, isDone: boolean) {
    if (this.pers.isNoDiary) {
      return;
    }
    let tDate: moment.Moment = moment(task.date).startOf('day');
    let diary = this.pers.Diary.find(n => moment(n.date).startOf('day').isSame(tDate));
    if (diary) {
      let fullName = task.name + ' ' + task.curLvlDescr2;
      if (isDone) {
        diary.done = diary.done + fullName + '; '
      }
      else {
        diary.notDone = diary.done + fullName + '; '
      }
    }
  }

  /**
   * Добавить новую задачу к навыку
   * @param abil Навык.
   * @param newTsk Название задачи.
   */
  addTsk(abil: Ability, newTsk: string): any {
    var tsk = new Task();
    tsk.name = newTsk;

    this.GetRndEnamy(tsk);

    abil.tasks.push(tsk);
  }

  /**
   * Добавление задачи к квесту.
   * @param qwest Квест.
   * @param newTsk Название задачи.
   */
  addTskToQwest(qwest: Qwest, newTsk: string): any {
    var tsk = new Task();
    tsk.name = newTsk;
    tsk.tittle = tsk.name = newTsk;
    tsk.requrense = "нет";

    this.GetRndEnamy(tsk);

    qwest.tasks.push(tsk);

    this.sortQwestTasks(qwest);
  }

  changeExpKoef(isPlus: boolean) {
    let changeMinus = 1;
    if (isPlus) {
      let openAbs = this.pers.characteristics.reduce((a, b) => {
        return a + b.abilities.filter(n => n.value >= 1).length;
      }, 0);
      this.pers.expKoef += (changeMinus / (openAbs * 2));
    }
    else {
      this.pers.expKoef -= changeMinus;
    }
    if (this.pers.expKoef > 0) {
      this.pers.expKoef = 0;
    }
    if (this.pers.expKoef < -2) {
      this.pers.expKoef = -2;
    }
  }

  changeTes(task: Task, isUp: boolean) {
    let change = this.getTaskChangesExp(task, isUp);
    if (isUp) {
      task.tesValue += change;
    }
    else {
      task.tesValue -= change;
      if (task.tesValue < 0) {
        task.tesValue = 0;
      }
    }
  }

  changesAfter(isGood) {
    if (isGood == null) {
      isGood = true;
    }

    this.changes.afterPers = this.changes.getClone(this.pers);
    this.changes.showChanges(this.getCongrantMsg(), this.getFailMsg(), isGood);
  }

  changesBefore() {
    this.changes.beforePers = this.changes.getClone(this.pers);
  }

  /**
   * Проверка даты задачи.
   * @param tDate Дата задачи.
   * @param requrense Повтор задачи.
   */
  checkDate(tDate: Date, requrense: string, weekDays: string[]): any {
    if (requrense === "ежедневно"
      || requrense === "нет"
      || requrense === "через 1 день"
      || requrense === "через 2 дня"
      || requrense === "через 3 дня") {
      return true;
    }

    let weekDay = tDate.getDay();

    if (requrense === "будни") {
      if (weekDay === 1
        || weekDay === 2
        || weekDay === 3
        || weekDay === 4
        || weekDay === 5) {
        return true;
      }
    } else if (requrense === "выходные") {
      if (weekDay === 6
        || weekDay === 0) {
        return true;
      }
    } else if (requrense === 'дни недели') {
      switch (weekDay) {
        case 1:
          return weekDays.includes('пн');
        case 2:
          return weekDays.includes('вт');
        case 3:
          return weekDays.includes('ср');
        case 4:
          return weekDays.includes('чт');
        case 5:
          return weekDays.includes('пт');
        case 6:
          return weekDays.includes('сб');
        case 0:
          return weekDays.includes('вс');

        default:
          return false;
      }
    }
    else if (requrense === "пн,ср,пт") {
      if (weekDay === 1
        || weekDay === 3
        || weekDay === 5) {
        return true;
      }
    } else if (requrense === "вт,чт,сб") {
      if (weekDay === 2
        || weekDay === 4
        || weekDay === 6) {
        return true;
      }
    } else if (requrense === "пн,вт,чт,сб") {
      if (weekDay === 1
        || weekDay === 2
        || weekDay === 4
        || weekDay === 6) {
        return true;
      }
    } else if (requrense === "не суббота") {
      if (weekDay != 6) {
        return true;
      }
    } else if (requrense === "не воскресенье") {
      if (weekDay != 0) {
        return true;
      }
    }

    return false;
  }

  checkNullOrUndefined(v) {
    if (v == null || v == undefined) {
      return true;
    }

    return false;
  }

  /**
   * Проверка задачи - доступна ли она сейчас.
   * @param tsk Задача.
   */
  checkTask(tsk: Task): any {
    let date = new Date(tsk.date).setHours(0, 0, 0, 0);
    let now = new Date();

    // Проверка по дате
    if (now.valueOf() >= date.valueOf()) {
      return true;
    }
  }

  clearDiary() {
    let params = [];

    if (this.pers.Diary.length > 0) {
      params = JSON.parse(JSON.stringify(this.pers.Diary[0].params));
    }

    this.pers.Diary = [];
    this.pers.Diary.unshift(new Diary(moment().startOf('day').toDate(), params));
    this.savePers(false);
  }

  // checkTaskStates(tsk: Task) {
  //   tsk.statesDescr = [];
  //   // Ability.rangse.forEach(rang => {
  //   //   // Последний ранг не добавляем
  //   //   // if (rang.val < Ability.maxValue) {
  //   //   this.addTaskDescrState(rang, tsk);
  //   //   //}
  //   // });
  // }

  /**
   * Расчет таблицы для кумулятивных расчетов получения наград.
   */
  countRewProbCumulative(): any {
    let cumulative = 0;
    this.pers.rewards.forEach(r => {
      cumulative += r.probability / 100;
      r.cumulative = cumulative;
    });
  }

  countToatalRewProb() {
    if (this.pers.rewards.length === 0) {
      this.pers.totalRewardProbability = 0;
    }
    else {
      this.pers.totalRewardProbability = this.pers.rewards.reduce((prev, cur) => {
        return +prev + +cur.probability;
      }, 0);
    }
  }

  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }

  /**
   * Удаление навыка по идентификатору.
   * @param id Идентификатор.
   */
  delAbil(id: string): any {
    this.pers.characteristics.forEach(cha => {
      cha.abilities = cha.abilities.filter(n => {
        return n.id != id
      });
    });

    for (const qw of this.pers.qwests) {
      if (qw.abilitiId == id) {
        qw.abilitiId = null;
      }
    }
  }

  /**
   * Удаление награды из инвентаря.
   * @param rev Награда.
   */
  delInventoryItem(rev: Reward): any {
    this.pers.inventory = this.pers.inventory.filter(n => {
      return n != rev;
    });
  }

  /**
   * Удалить квест.
   * @param id Идентификатор квеста.
   */
  delQwest(id: string): any {
    this.removeParrents(id);
    this.pers.qwests = this.pers.qwests.filter(n => {
      return n.id != id;
    });
  }

  /**
   * Удаление награды.
   * @param id Идентификатор.
   */
  delReward(id: string): any {
    this.pers.rewards = this.pers.rewards.filter(n => {
      return n.id != id;
    });
  }

  /**
   * Удаление задачи у навыка.
   * @param abil Навык
   * @param id Идентификатор задачи
   */
  delTask(abil: Ability, id: string): any {
    abil.tasks = abil.tasks.filter(n => { return n.id != id });
  }

  /**
  * Удаление задачи у навыка.
  * @param abil Навык
  * @param id Идентификатор задачи
  */
  delTaskfromQwest(qwest: Qwest, id: string): any {
    qwest.tasks = qwest.tasks.filter(n => { return n.id != id });
  }

  /**
   * Поиск задачи и навыка по идентификатору у персонажа.
   * @param id Идентификатор задачи.
   * @param task Задача, которая будет найдена.
   * @param abil Навык, который будет найден.
   */
  findTaskAnAb(id: string, task: Task, abil: Ability) {
    for (const cha of this.pers.characteristics) {
      for (const ab of cha.abilities) {
        for (const tsk of ab.tasks) {
          if (tsk.id === id) {
            task = tsk;
            abil = ab;

            break;
          }
        }
      }
    }

    return { task, abil };
  }

  /**
   * Получение полностью всех задач (навыков) перса.
   */
  getAllAbTasks() {
    let tasks: Task[] = [];

    // Задачи навыков
    this.pers.characteristics.forEach(cha => {
      cha.abilities.forEach(ab => {
        // || ab.isOpen
        if ((ab.value >= 1) && !ab.isNotDoneReqvirements) {
          ab.tasks.forEach(tsk => {
            if (tsk.states.length > 0 && tsk.isSumStates && !tsk.isStateInTitle) {
              tsk.states.forEach(st => {
                if (st.isActive) {
                  let t = this.getTskFromState(tsk, st, true);
                  tasks.push(t);
                }
              });
            }
            else {
              tasks.push(tsk);
            }
          });
        }

      });
    });

    tasks = tasks.sort((a, b) => {
      return a.order - b.order;
    });

    this.pers.tasks = tasks;
  }

  /**
   * Загрузить персонажей с уровнем, большим чем 0;
   */
  getChampions(): Observable<any> {
    //var dat = new Date();
    //dat.setDate(dat.getDate() - 21);

    return this.db.collection<Pers>('/pers', ref => ref.where('level', '>=', 1)
      .orderBy('level', 'desc'))
      .valueChanges()
      .pipe(
        map(champ => champ.map(n => {
          return { Name: n.name, Level: n.level, Pic: n.image ? n.image : n.rang.img, Id: n.id, date: new Date(n.dateLastUse) };
        })),
        //.filter(n => n.date.valueOf() >= dat.valueOf())),
        take(1),
        share()
      );
  }

  getEraCostLvl(curAbLvl: number) {
    //return curAbLvl + 1;
    if (curAbLvl == 0) {
      return 10;
    }
    return curAbLvl;
  }

  getEraCostTotal(curAbLvl: number) {
    let cost = 0;
    for (let i = 0; i < curAbLvl; i++) {
      cost += this.getEraCostLvl(i);
    }

    return cost;
  }

  getExpKoef(isPlus: boolean): number {
    if (this.pers.isTES) {
      return 1;
    }

    const toRet = Math.pow(2, this.pers.expKoef);

    return toRet;
  }

  getImgPath(num: number, lvl: number): string {
    let result: string = ''; //'assets/img/' + lvl + '/';

    let ss = '000' + num;
    ss = ss.substr(ss.length - 3);

    result += ss; // + '.jpg';

    return result;
  }

  getImgPathRandome(lvl: number): string {
    let im: number = 0;
    let max: number = 0;

    switch (lvl) {
      case 1:
        max = this.mn1Count;
        break;
      case 2:
        max = this.mn2Count;
        break;
      case 3:
        max = this.mn3Count;
        break;
      case 4:
        max = this.mn4Count;
        break;
      case 5:
        max = this.mn5Count;
        break;

      default:
        max = this.mn1Count;
        break;
    }

    if (!this.pers.mnstrCounter) {
      this.pers.mnstrCounter = 0;
    }
    if (this.pers.mnstrCounter >= max) {
      this.pers.mnstrCounter = 0;
    }

    this.pers.mnstrCounter++;
    im = this.pers.mnstrCounter;

    //im = this.randomInteger(1, max);

    let result: string = '';

    let ss = '000' + im;
    ss = ss.substr(ss.length - 3);

    result += ss;

    return result;
  }

  /**
   * Получить персонажа.
   */
  getPers(usr: FirebaseUserModel): any {
    this.loadPers(usr.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        // Если перс есть
        if (data != undefined) {
          this.setPers(data);
        }
        // Если перса пока что не было
        else if (data === undefined && usr.id != undefined) {
          const pers = new Pers();
          pers.userId = usr.id;
          pers.id = usr.id;
          pers.level = 0;
          pers.prevExp = 0;
          pers.nextExp = 0;

          this.setPers(pers);
        }
      });
  }

  getPersTasks() {
    let tasks: Task[] = [];

    // Задачи навыков
    if (!this.pers.sellectedView || this.pers.sellectedView === "навыки") {
      this.pers.characteristics.forEach(cha => {
        cha.abilities.forEach(ab => {
          // || ab.isOpen
          if ((ab.value >= 1) && !ab.isNotDoneReqvirements) {
            ab.tasks.forEach(tsk => {
              if (this.checkTask(tsk)) {
                if (tsk.isSumStates && tsk.states.length > 0 && !tsk.isStateInTitle) {
                  tsk.states.forEach(st => {
                    if (st.isActive && !st.isDone) {
                      let stT = this.getTskFromState(tsk, st, false);
                      tasks.push(stT);
                    }
                  });
                }
                else {
                  tasks.push(tsk);
                }
              }
            });
          }

        });
      });

      // Удаляем все задачи с датами, большими чем минимальная
      if (tasks.length > 0) {
        let minDate = new Date().setHours(0, 0, 0, 0);

        tasks.forEach(t => {
          let tDate = new Date(t.date).setHours(0, 0, 0, 0);

          // По дате
          if (tDate.valueOf() < minDate.valueOf()) {
            minDate = tDate;
          }
        });

        tasks = tasks.filter(n => {
          return new Date(n.date).setHours(0, 0, 0, 0).valueOf() <= minDate.valueOf();
        });
      }
    }
    // Задачи квестов
    else {
      this.absMap = this.pers.characteristics.reduce((a, b) => a.concat(b.abilities), []).reduce((acc, el) => {
        if (!acc[el.id]) {
          acc[el.id] = el;
        }
        return acc;
      }, {});
      if (!this.pers.isGlobalView) {
        this.getQwestTasks();
        tasks = this.pers.tasks;
      }
      else {
        this.pers.qwests.forEach(qw => {
          if (qw.parrentId) {
            return;
          }
          // Если связанный навык не активен, либо задачи на сегодня выполнены.
          if (!this.checkQwestAb(qw)) {
            return;
          }
          for (let index = 0; index < qw.tasks.length; index++) {
            const tsk = qw.tasks[index];

            if (!tsk.isDone) {
              if (this.checkTask(tsk)) {
                const subTasks = tsk.states.filter(n => !n.isDone);
                if (subTasks.length > 0) {
                  let stT = this.getTskFromState(tsk, subTasks[0], false);
                  tasks.push(stT);
                  if (qw.id === this.pers.currentQwestId) {
                    this.setCurInd(tasks.indexOf(stT));
                  }
                }
                else {
                  tasks.push(tsk);
                  if (qw.id === this.pers.currentQwestId) {
                    this.setCurInd(tasks.indexOf(tsk));
                  }
                }
              }
              break;
            }
          }
        });
      }
    }

    return tasks;
  }

  checkQwestAb(qw: Qwest): boolean {
    if (qw.abilitiId) {
      let ab: Ability = this.absMap[qw.abilitiId];
      if (ab) {
        if (ab.value >= 1 && !ab.isNotDoneReqvirements) {
          if (ab.tasks && ab.tasks.length > 0) {
            if (!this.checkTask(ab.tasks[0])) {
              return false;
            }
          }
          else {
            return false;
          }
        }
        else {
          return false;
        }
      }
    }

    return true;
  }

  getQwestTasks(isSort = false) {
    let qwest = this.pers.qwests.find(n => n.id == this.pers.currentQwestId);
    if (!qwest && this.pers.qwests.length > 0) {
      qwest = this.pers.qwests.find(n => n.tasks.length > 0 && n.progressValue < 100 && this.checkQwestAb(n));
    }
    if (qwest) {
      let tasks: Task[] = [];
      for (let i = 0; i < qwest.tasks.length; i++) {
        const tsk = qwest.tasks[i];
        if (!tsk.isDone) {
          if (!isSort) {
            if (this.checkTask(tsk)) {
              const subTasks = tsk.states.filter(n => !n.isDone);
              if (subTasks.length > 0) {
                let stT = this.getTskFromState(tsk, subTasks[0], false);
                tasks.push(stT);
              }
              else {
                tasks.push(tsk);
              }
            }
          }
          else {
            tasks.push(tsk);
          }
        }
      }
      this.pers.tasks = tasks;
    }
    else {
      this.pers.tasks = [];
    }

    this.setCurInd(0);
  }

  getSet(tsk: Task, aim: number): number[] {
    let result: number[] = [];

    if (aim > this.pers.maxAttrLevel && !this.pers.isTES) {
      this.getSetMaxNeatEnd(aim, result, tsk);
    }
    else {
      this.getSetLinear(aim, result, tsk);
    }

    return result;
  }

  getTskValForState(value: number, maxValue: number) {
    let progres = (Math.floor(value)) / (+this.pers.maxAttrLevel);
    let ret = Math.floor(progres * maxValue);
    if (ret < 1) {
      ret = 1;
    }

    return ret;
  }

  /**
   * Получить коефициент - чем реже задача тем больше за нее опыта!
   * @param requrense Повтор задачи.
   */
  getWeekKoef(requrense: string, isPlus: boolean, weekDays: string[]): number {
    let base = 5.0;

    if (requrense === 'будни') {
      return base / 5.0;
    }
    if (requrense === 'выходные') {
      return base / 2.0;
    }
    if (requrense === 'ежедневно') {
      return base / 5.0;
    }
    if (requrense === 'пн,ср,пт') {
      return base / 3.0;
    }
    if (requrense === 'вт,чт,сб') {
      return base / 3.0;
    }
    if (requrense === 'пн,вт,чт,сб') {
      return base / 4.0;
    }
    if (requrense === 'не суббота') {
      return base / 5.0;
    }
    if (requrense === 'не воскресенье') {
      return base / 5.0;
    }
    if (requrense === 'дни недели') {
      return base / weekDays.length;
    }
    if (isPlus) {
      if (requrense === 'через 1 день') {
        return (base / 7.0) * 2;
      }
      if (requrense === 'через 2 дня') {
        return (base / 7.0) * 3;
      }
      if (requrense === 'через 3 дня') {
        return (base / 7.0) * 4;
      }
    }

    return 1.0;
  }

  /**
   * Загрузить персонажа из БД.
   * @param userId Идентификатор пользователя
   */
  loadPers(userId: string) {
    return this.db.collection<Pers>('pers').doc(userId).valueChanges().pipe(take(1), share());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openCharact(id: any) {
    this.router.navigate(['/pers/characteristic', id]);
  }

  openPers() {
    this.router.navigate(['/pers']);
  }

  openTask(id: any) {
    this.router.navigate(['/pers/task', id, false]);
  }

  randomInteger(min: number, max: number): number {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  /**
   * Обновление всех картинок монстров.
   */
  reImages() {
    this.pers.characteristics.forEach(ch => {
      ch.abilities.forEach(ab => {
        ab.tasks.forEach(tsk => {
          this.GetRndEnamy(tsk);
          tsk.states.forEach(st => {
            this.GetRndEnamy(st);
          });
        });
      });
    });

    this.pers.qwests.forEach(qw => {
      qw.tasks.forEach(tsk => {
        this.GetRndEnamy(tsk);
      });
    });

    this.savePers(false);
  }

  returnToAdventure() {
    this.pers.isRest = false;
    for (const ch of this.pers.characteristics) {
      for (const ab of ch.abilities) {
        for (const tsk of ab.tasks) {
          let tskDate: moment.Moment = moment(tsk.date);
          if (tskDate.isBefore(moment(new Date()), 'd')) {
            tsk.date = new Date();
          }
        }
      }
    }
    this.savePers(false);
  }

  saveGlobalTaskViewState(b: boolean) {
    this.isGlobalTaskView = b;
    this.pers.isGlobalView = b;
  }

  /**
   * Записать персонажа в БД.
   */
  savePers(isShowNotif: boolean, plusOrMinus?): any {
    this.pers.maxAttrLevel = 10;

    let allAbsDic: Map<string, Task> = new Map<string, Task>();
    for (const ch of this.pers.characteristics) {
      for (const ab of ch.abilities) {
        for (const t of ab.tasks) {
          allAbsDic.set(t.id, t);
        }
      }
    }

    let totalAbils: number = 0;

    this.pers.dateLastUse = new Date();

    let chaMax = 0;
    let chaCur = 0;
    let abCurTotal = 0;
    let abMaxTotal = 0;
    let skillCur = 0;
    let skillMax = 0;

    this.pers.characteristics.forEach(cha => {
      if (this.pers.isTES && cha.startRang.val == 0) {
        let rng = new Rangse();
        rng.val = 1;
        rng.img = '';
        rng.name = '' + 1;
        cha.startRang = rng;
      }
      let abMax = 0, abCur = 0;

      let qwestMap = this.pers.qwests.reduce((acc, el) => {
        if (el.abilitiId) {
          if (!acc[el.abilitiId]) {
            acc[el.abilitiId] = [];
          }
          acc[el.abilitiId].push({ qwId: el.id, qwName: el.name });
        }
        return acc;
      }, {});

      cha.abilities.forEach(ab => {
        let tskMax = 0;
        let tskCur = 0;
        totalAbils += 1;

        // Если задач нет - все равно учитываем
        if (ab.tasks.length == 0) {
          skillCur += 0;

          skillMax += this.pers.maxAttrLevel;
        }

        let taskTes = 0;
        ab.tasks.forEach(tsk => {
          taskTes += tsk.tesValue;
          tsk.plusToNames = [];
          tsk.plusToNames.push(new plusToName(cha.name, cha.id, '/pers/characteristic', ''));

          const qwLink = qwestMap[ab.id];
          if (qwLink) {
            for (const q of qwLink) {
              tsk.plusToNames.push(new plusToName('🔗 ' + q.qwName, q.qwId, '', 'qwestTask'));
            }
          }

          // Для показа опыта за задачу
          if (tsk.requrense != 'нет') {
            let exp = this.getTaskChangesExp(tsk, true) * 10.0;
            exp = Math.floor(exp);
            tsk.plusToNames.push(new plusToName('+' + exp + ' exp', null, null, ''));
          }

          this.setTaskValueAndProgress(tsk);
          this.setTaskTittle(tsk);
          this.CheckSetTaskDate(tsk);


          if (tsk.value > this.pers.maxAttrLevel) {
            tsk.value = this.pers.maxAttrLevel;
          }

          tskMax += this.pers.maxAttrLevel;
          tskCur += tsk.value;

          let koef = Task.getHardness(tsk);

          skillCur += tsk.value * koef;
          skillMax += this.pers.maxAttrLevel * koef;


          let tval = Math.floor(1 + tsk.tesValue);
          if (tval > 10) {
            tval = 10;
          }
          tsk.roundVal = ab.isOpen ? tval : 0;
        });

        this.setAbValueAndProgress(ab, tskCur, tskMax, taskTes);
        this.setAbRang(ab);

        abMax += this.pers.maxAttrLevel * Task.getHardness(ab.tasks[0]);
        abMaxTotal += this.pers.maxAttrLevel* Task.getHardness(ab.tasks[0]);
        abCur += ab.value* Task.getHardness(ab.tasks[0]);
        abCurTotal += ab.value* Task.getHardness(ab.tasks[0]);
      });

      let start = cha.startRang.val;
      let max = this.pers.maxAttrLevel;
      if (this.pers.isTES) {
        max = 1 + this.getMaxTes();
      }
      let left = max - start;

      if (!this.pers.isNoAbs) {
        this.setChaValueAndProgress(abCur, abMax, cha, start, left);
        this.setChaRang(cha);
      }

      // Награды
      // Общая вероятность награды
      this.countToatalRewProb();
      this.countRewProbCumulative();

      chaMax += this.pers.maxAttrLevel - start;
      chaCur += cha.value - start;
    });

    // Обновляем квесты
    this.pers.qwests.forEach(qw => {
      let totalTsks = qw.tasks.length;
      let doneTsks = qw.tasks.filter(n => {
        return n.isDone === true;
      }).length;

      qw.tasks.forEach(tsk => {
        tsk.plusToNames = [];
        tsk.tittle = tsk.name;
        tsk.plusName = qw.name;

        tsk.plusToNames.push(new plusToName(qw.name, qw.id, '/pers/qwest', ''));

        let abName = '';
        let abId;
        if (qw.abilitiId) {
          for (const ch of this.pers.characteristics) {
            for (const ab of ch.abilities) {
              if (ab.id == qw.abilitiId) {
                abName = ab.name;
                abId = ab.id;
                break;
              }
            }
          }
          tsk.plusToNames.push(new plusToName('🔗 ' + abName, qw.id, '', 'abTask'));
        }

        // if (tsk.descr) {
        //   tsk.plusToNames.push(new plusToName(tsk.descr, '', '', ''));
        // }
        if (tsk.states.length > 0) {
          tsk.states = tsk.states.sort((a, b) => {
            return a.isDone === b.isDone ? 0 : b.isDone ? -1 : 1;
          });
        }
      });

      if (totalTsks > 0) {
        qw.progressValue = (doneTsks / totalTsks) * 100.0;
      }
      else {
        qw.progressValue = 0;
      }

      qw.tasksDone = doneTsks;

      // Сортировка задач квеста
      this.sortQwestTasks(qw);
    });

    // Сортировка квестов по следующим/предыдущим
    let ordered = this.pers.qwests.filter(q => !q.parrentId);

    const idMapping = this.pers.qwests.reduce((acc, el, i) => {
      acc[el.id] = i;
      return acc;
    }, {});


    this.pers.qwests.forEach(el => {
      // Handle the root element
      if (!el.parrentId) {
        return;
      }

      // Use our mapping to locate the parent element in our data array
      const parentEl = this.pers.qwests[idMapping[el.parrentId]];
      const idx = ordered.indexOf(parentEl);
      // Add our current el to its parent's `children` array
      ordered.splice(idx + 1, 0, el);
    });

    this.pers.qwests = ordered;

    //this.pers.qwests = ordered;

    // Сортировка квестов по прогрессу
    // this.pers.qwests = this.pers.qwests.sort((a, b) => {
    //   return (b.progressValue - a.progressValue);
    //   //return a.name.localeCompare(b.name);
    // });

    // this.setPersExp(chaCur, chaMax);
    this.setPersExpAndAbPoints(chaCur, chaMax, abCurTotal, abMaxTotal, skillCur, skillMax, totalAbils); // Опыт чисто по навыкам
    this.setPersRang();

    // Прогресс ранга
    let curLvl = this.pers.level;
    let cur = curLvl - this.pers.rang.val;
    let tot = this.pers.nextRangLvl - this.pers.rang.val;
    if (tot === 0) {
      tot = 1;
    }

    this.pers.rangProgress = (cur / tot) * 100;

    this.setAbUpVis(allAbsDic);

    // Сортировка характеристик
    this.pers.characteristics
      = this.pers.characteristics.sort((a, b) => {
        return (a.value - b.value);
        // let aHasSameLvl = 0;
        // if (a.HasSameAbLvl) {
        //   aHasSameLvl = 1;
        // }
        // let bHasSameLvl = 0;
        // if (b.HasSameAbLvl) {
        //   bHasSameLvl = 1;
        // }

        // if (this.pers.IsAbUp) {
        //   // Если есть с такой же сложностью навыка
        //   if (aHasSameLvl != bHasSameLvl) {
        //     return -(aHasSameLvl - bHasSameLvl);
        //   }
        //   // По значению по возрастанию
        //   if (a.value != b.value) {
        //     return -(a.value - b.value);
        //   }
        // } else {
        //   // По значению по убыванию
        //   if (a.value != b.value) {
        //     return -(a.value - b.value);
        //   }
        // }

        // return 0;
      });
    // Сортировка навыков
    this.pers.characteristics.forEach(cha => {
      cha.abilities = cha.abilities.sort(this.abSorter());
    });

    let tasks: Task[] = this.getPersTasks();

    this.sortPersTasks(tasks);

    this.sortRevards();

    this.setCurPersTask();

    // Анализ дневника
    if (!this.pers.isNoDiary) {
      let prevD: DiaryParam[] = null;

      if (this.pers.Diary.length > 0) {
        for (let i = this.pers.Diary.length - 1; i >= 0; i--) {
          let el = this.pers.Diary[i].params;
          el.forEach(p => {
            if (prevD == null) {
              p.state = 'eq';
            }
            else {
              let prevP = prevD.find(n => n.id == p.id);
              if (prevP) {
                if (p.val > prevP.val) {
                  p.state = 'up';
                }
                else if (p.val < prevP.val) {
                  p.state = 'down';
                }
                else {
                  p.state = 'eq';
                }
              }
            }
          });

          prevD = el;
        }
      }
    }
    else {
      this.pers.Diary = [];
    }

    // Картинки всем
    for (const ch of this.pers.characteristics) {
      if (!ch.image) {
        ch.image = 'assets/icons/defCha.png';
      }
      for (const ab of ch.abilities) {
        if (!ab.image) {
          ab.image = 'assets/icons/defAbil.png';
        }
      }
    }
    for (const qw of this.pers.qwests) {
      if (!qw.image) {
        qw.image = 'assets/icons/defQwest.png';
      }
    }
    //----------------------------

    // Настройки
    if (this.pers.isEra) {
      this.pers.isTES = false;
    }
    else if (this.pers.isTES) {
      this.pers.isEra = false;
    }

    const persJson = JSON.parse(JSON.stringify(this.pers));

    if (this.isSynced || !this.pers.isOffline) {
      this.db.collection('pers').doc(this.pers.id)
        .set(persJson);
    }

    localStorage.setItem("isOffline", JSON.stringify(this.pers.isOffline));
    localStorage.setItem("pers", JSON.stringify(this.pers));

    this.isSynced = false;
  }

  /**
   * Задаем видимости для прокачки навыков.
   */
  setAbUpVis(allAbsDic: Map<string, Task>) {
    this.pers.IsAbUp = false;
    this.pers.HasSameAbLvl = false;

    for (const ch of this.pers.characteristics) {
      ch.HasSameAbLvl = false;
      for (const ab of ch.abilities) {
        ab.HasSameAbLvl = false;
        ab.isNotChanged = false;
        ab.isNotDoneReqvirements = false;
        for (const tsk of ab.tasks) {
          // Что навык настроен
          if (
            (tsk.value < 1 || (tsk.value <= 1 && this.pers.isTES))
            && tsk.requrense == 'будни'
            && tsk.aimCounter == 0
            && tsk.aimTimer == 0
            && tsk.states.length == 0
          ) {
            ab.isNotChanged = true;
          }

          // Требования
          if (!tsk.reqvirements) {
            tsk.reqvirements = [];
          }
          tsk.reqvirements = tsk.reqvirements.filter(n => allAbsDic.has(n.elId));
          tsk.reqvirements.forEach(q => q.elName = allAbsDic.get(q.elId).name);
          tsk.reqvirements.forEach(q => q.isDone = allAbsDic.get(q.elId).value >= q.elVal);

          if (tsk.reqvirements.some(n => allAbsDic.get(n.elId).value < n.elVal)) {
            tsk.IsNextLvlSame = false;
            tsk.mayUp = false;
            ab.isNotDoneReqvirements = true;
          }
          else {
            let cost = 1;

            if (true) {
              //cost = tsk.value + 1;
              cost = 0;

              let cur = tsk.value;
              let next = tsk.value;

              while (true) {
                next++;
                let prev;

                prev = next - 1;

                if (prev != tsk.value && tsk.statesDescr[prev] != tsk.statesDescr[next]) {
                  break;
                }
                if (next > 10) {
                  break;
                }

                cost += 1;
              }

              tsk.nextUp = next - 1;
            }

            if (!this.pers.isEra) {
              tsk.cost = cost;
            }
            else {
              tsk.cost = this.getEraCostLvl(tsk.value);
            }

            if ((tsk.value >= 1) && tsk.statesDescr[Math.floor(tsk.value)] == tsk.statesDescr[Math.floor(tsk.value + 1)]) {
              tsk.IsNextLvlSame = true;
              ch.HasSameAbLvl = true;
              ab.HasSameAbLvl = true;
              this.pers.HasSameAbLvl = true;
            }
            else {
              tsk.IsNextLvlSame = false;
            }

            if (!this.pers.isEra) {
              cost = 1;
            }
            else {
              cost = tsk.cost;
            }

            if (this.pers.ON > 0 && tsk.value <= this.pers.maxAttrLevel - 1 && this.pers.ON >= cost) {
              tsk.mayUp = true;
              this.pers.IsAbUp = true;
            } else {
              tsk.IsNextLvlSame = false;
              tsk.mayUp = false;
            }

            if (this.pers.isTES && tsk.value >= 1) {
              tsk.IsNextLvlSame = false;
              tsk.mayUp = false;
            }
          }
        }
      }
    }

    if (this.pers.HasSameAbLvl) {
      for (const ch of this.pers.characteristics) {
        for (const ab of ch.abilities) {
          for (const tsk of ab.tasks) {
            if (!tsk.IsNextLvlSame) {
              if (!this.pers.isEqLvlUp) {
                tsk.mayUp = false;
              }
            }
          }
        }
      }
    }
  }

  setCurInd(i: number): any {
    this.pers.currentTaskIndex = i;
    this.pers.currentTask = this.pers.tasks[i];

    if (this.pers.sellectedView == 'квесты') {
      if (this.pers.currentTask && this.pers.currentTask.plusToNames && this.pers.currentTask.plusToNames.length > 0) {
        this.pers.currentQwestId = this.pers.currentTask.plusToNames[0].linkId;
      }
    }
  }

  setPers(data: any) {
    const pers = data;
    let prs: Pers;

    if (!this.isOffline) {
      prs = (pers as Pers);
    }
    else {
      prs = JSON.parse(pers);
    }

    if (prs.tasks && prs.tasks.length > 0) {
      prs.currentTaskIndex = 0;
      prs.currentTask = prs.tasks[0];
    }

    this.checkPersNewFields(prs);

    this.pers = prs;

    this.setView('навыки');

    if (!this.pers.imgVers || this.pers.imgVers < 1) {
      this.pers.imgVers = 1;
      this.reImages();
    }
  }

  setStatesNotDone(tsk: Task) {
    for (let i = 0; i < tsk.states.length; i++) {
      const element = tsk.states[i];
      element.isDone = false;
      element.isActive = false;
    }
  }

  /**
   * Задать следующую дату задачи и время выполнения.
   * @param tsk Задача.
   */
  setTaskNextDate(tsk: Task, isPlus: boolean) {
    let td = new Date(tsk.date);
    let tdDate = new Date(tsk.date);
    tdDate.setHours(0, 0, 0, 0);

    // Задаем следующий день
    if (isPlus) {
      if (tsk.requrense == 'через 1 день') {
        td.setDate(td.getDate() + 2);
      }
      else if (tsk.requrense == 'через 2 дня') {
        td.setDate(td.getDate() + 3);
      }
      else if (tsk.requrense == 'через 3 дня') {
        td.setDate(td.getDate() + 4);
      }
      else {
        td.setDate(td.getDate() + 1);
      }
    }
    else {
      td.setDate(td.getDate() + 1);
    }

    tsk.date = td;

    // Задаем время выполнения для сортировки
    tsk.timeForSort = Date.now().valueOf() - tdDate.valueOf();

    // Все состояния делаем невыполненными
    if (tsk.states.length > 0 && tsk.isSumStates) {
      for (let i = 0; i < tsk.states.length; i++) {
        tsk.states[i].isDone = false;
      }
    }
  }

  /**
   * Установить "порядок" для автосортировки.
   * @param task Задача
   * @param isPlus Нажат плюс?
   * @param isToEnd В конец списка?
   */
  setTaskOrder(task: Task, isPlus: boolean, isToEnd: boolean) {
    // if (!isPlus && task.lastNotDone) {
    //   task.order = 9999;
    // }
    // else {
    if (isToEnd) {
      task.order = this.pers.curEndOfListSeq;
      this.pers.curEndOfListSeq++;
    }
    else {
      let dt = new Date(task.date).setHours(0, 0, 0, 0);
      let now = new Date().setHours(0, 0, 0, 0);
      // Если дата задачи - вчера
      if (dt.valueOf() < now.valueOf()) {
        task.order = this.pers.prevOrderSeq;
        this.pers.prevOrderSeq++;
      }
      // Если сегодня
      else {
        task.order = this.pers.curOrderSeq;
        this.pers.curOrderSeq++;
      }
    }
    // }
  }

  /**
   * Задать пользователя.
   * @param usr Пользователь.
   */
  setUser(usr: FirebaseUserModel) {
    this.user = usr;
    this.getPers(usr);
  }

  /**
   * Задать вид - задачи, квесты.
   * @param name Название вида.
   */
  setView(name: string): any {
    this.pers.sellectedView = name;
    this.setCurInd(0);
    this.savePers(false);
  }

  showAbility(ab: Ability) {
    if (Pers.GameSettings.isNoAbilities) {
      let tsk = ab.tasks[0];
      if (tsk) {
        this.router.navigate(['/pers/task', tsk.id, false]);
      }
    }
    else {
      this.router.navigate(['/pers/ability', ab.id]);
    }
  }

  sortPersTasks(tasks: Task[]) {
    this.pers.tasks = tasks.sort((a, b) => {
      // Квесты не сортируем
      if (a.requrense === 'нет' && b.requrense === 'нет') {
        return 0;
      }

      // По типу
      let aType = a.requrense === 'нет' ? 0 : 1;
      let bType = b.requrense === 'нет' ? 0 : 1;

      if (aType != bType) {
        return -(aType - bType);
      }

      let aDate = new Date(a.date).setHours(0, 0, 0, 0);
      let bDate = new Date(b.date).setHours(0, 0, 0, 0);
      let aValDate = aDate.valueOf();
      let bValDate = bDate.valueOf();

      // По дате
      if (aValDate != bValDate) {
        return aDate.valueOf() - bDate.valueOf();
      }

      // По Order
      if (!a.order) {
        a.order = 0;
      }
      if (!b.order) {
        b.order = 0;
      }
      if (a.order != b.order) {
        return a.order - b.order;
      }

      return a.name.localeCompare(b.name);
    });
  }

  sortRevards() {
    this.pers.rewards.forEach(rev => {
      if (rev.rare == Pers.commonRevSet.name) {
        rev.cumulative = Pers.commonRevSet.cumulative;
      } else if (rev.rare == Pers.uncommonRevSet.name) {
        rev.cumulative = Pers.uncommonRevSet.cumulative;
      } else if (rev.rare == Pers.rareRevSet.name) {
        rev.cumulative = Pers.rareRevSet.cumulative;
      } else if (rev.rare == Pers.epicRevSet.name) {
        rev.cumulative = Pers.epicRevSet.cumulative;
      } else if (rev.rare == Pers.legendaryRevSet.name) {
        rev.cumulative = Pers.legendaryRevSet.cumulative;
      } else {
        rev.cumulative = Pers.commonRevSet.cumulative;
        rev.rare = Pers.commonRevSet.name;
      }
    });

    this.pers.rewards = this.pers.rewards.sort((a, b) => a.cumulative - b.cumulative);
  }

  isSynced: boolean = false;
  sync(isDownload) {
    this.isSynced = true;

    if (isDownload) {
      // download
      this.loadPers(this.pers.userId).subscribe(n => {
        let prs: Pers = n as Pers;
        this.pers = prs;
        this.savePers(false);
      });
    }
    else {
      // upload
      this.savePers(false);
    }
  }

  /**
   * Клик минус по задаче.
   * @param id Идентификатор задачи.
   */
  taskMinus(id: string, notClearTosts?: boolean) {
    // Находим задачу
    let task: Task;
    let abil: Ability;

    ({ task, abil } = this.findTaskAnAb(id, task, abil));
    if (task) {
      this.addToDiary(task, false);

      // Следующая дата
      this.setTaskNextDate(task, false);
      this.setStatesNotDone(task);

      // Минусуем значение
      if (this.pers.isTES) {
        this.changeTes(task, false);
      }
      else {
        this.pers.exp -= this.getTaskChangesExp(task, false);
        if (this.pers.exp < 0) {
          this.pers.exp = 0;
        }
      }

      task.lastNotDone = true;

      this.setCurInd(0);
      this.changeExpKoef(false);
      this.savePers(true, 'minus');

      return 'навык';
    }
  }

  /**
   * Клик плюс по задаче.
   * @param id Идентификатор задачи.
   */
  taskPlus(id: string) {
    // Находим задачу
    let task: Task;
    let abil: Ability;

    ({ task, abil } = this.findTaskAnAb(id, task, abil));
    if (task) {
      // Разыгрываем награды
      this.CasinoRevards(task);

      this.addToDiary(task, true);

      // Счетчик обновлений стейтов
      if (task.isStateRefresh) {
        if (task.refreshCounter == null || task.refreshCounter == undefined) {
          task.refreshCounter = 0;
        }
        else {
          task.refreshCounter++;
        }
      }

      // Следующая дата
      this.setTaskNextDate(task, true);
      this.setStatesNotDone(task);

      // Плюсуем значение
      if (this.pers.isTES) {
        this.changeTes(task, true);
      }
      else {
        this.pers.exp += this.getTaskChangesExp(task, true);
      }

      task.lastNotDone = false;
      this.setCurInd(0);
      this.changeExpKoef(true);

      this.savePers(true, 'plus');

      return 'навык';
    }
    // Ищем в квестах
    for (let index = 0; index < this.pers.qwests.length; index++) {
      const qw = this.pers.qwests[index];
      qw.tasks.forEach(tsk => {
        if (tsk.id === id) {
          this.pers.currentQwestId = qw.id;
          this.pers.qwests.unshift(this.pers.qwests.splice(index, 1)[0]);

          task = tsk;
        }
      });
    }

    if (task) {
      task.isDone = true;
      this.savePers(true, 'plus');
      this.setCurInd(0);

      return 'квест';
    }
  }

  upAbility(ab: Ability) {
    let isOpenForEdit = false;

    for (let i = 0; i < ab.tasks.length; i++) {
      const tsk: Task = ab.tasks[i];

      if (tsk.value < 1) {
        tsk.date = new Date();
        tsk.order = -1;
        tsk.states.forEach(st => {
          st.order = -1;
        });
        isOpenForEdit = true;
      }
      if (!ab.isOpen) {
        tsk.date = new Date();
        tsk.order = -1;
        tsk.states.forEach(st => {
          st.order = -1;
        });
        isOpenForEdit = true;
      }

      let prevTaskVal = tsk.value;

      if (!this.pers.isEra) {
        tsk.value += 1;
      }
      else {
        //tsk.value = tsk.nextUp;
        tsk.value += 1;
      }

      let curTaskValue = tsk.value;

      this.GetRndEnamy(tsk);
      tsk.states.forEach(st => {
        st.value = tsk.value;
        this.GetRndEnamy(tsk);
      });

      this.changeLvlAbLogic(tsk, curTaskValue, prevTaskVal);
    }

    if (!ab.isOpen) {
      ab.isOpen = true;
    }

    this.savePers(true, 'plus');

    // Переходим в настройку навыка, если это первый уровень
    if (isOpenForEdit) {
      this.showAbility(ab);
    }
  }

  updateAbTasksImages() {
    for (const ch of this.pers.characteristics) {
      for (const ab of ch.abilities) {
        for (const tsk of ab.tasks) {
          this.GetRndEnamy(tsk);
          for (const st of tsk.states) {
            this.GetRndEnamy(st);
          }
        }
      }
    }
  }

  updateQwestTasksImages() {
    for (const qwest of this.pers.qwests) {
      for (const tsk of qwest.tasks) {
        this.GetRndEnamy(tsk);
        for (const sub of tsk.states) {
          this.GetRndEnamy(sub);
        }
      }
    }
  }

  /**
   * Розыгрыш наград.
   */
  private CasinoRevards(task: Task) {
    if (!this.pers.rewards || this.pers.rewards.length == 0) {
      return;
    }

    let rand = Math.random() * 100.0;

    let revType = '';

    // if (rand > 3) {
    //   return;
    // }

    // if (this.pers.isMax5) {
    //   if (task.value >= 5) {
    //     revType = Pers.legendaryRevSet.name;
    //   }
    //   else if (task.value >= 4) {
    //     revType = Pers.epicRevSet.name;
    //   }
    //   else if (task.value >= 3) {
    //     revType = Pers.rareRevSet.name;
    //   }
    //   else if (task.value >= 2) {
    //     revType = Pers.uncommonRevSet.name;
    //   }
    //   else {
    //     revType = Pers.commonRevSet.name;
    //   }
    // }
    // else {
    //   if (task.value >= 9) {
    //     revType = Pers.legendaryRevSet.name;
    //   }
    //   else if (task.value >= 7) {
    //     revType = Pers.epicRevSet.name;
    //   }
    //   else if (task.value >= 5) {
    //     revType = Pers.rareRevSet.name;
    //   }
    //   else if (task.value >= 3) {
    //     revType = Pers.uncommonRevSet.name;
    //   }
    //   else {
    //     revType = Pers.commonRevSet.name;
    //   }
    // }

    if (rand <= Pers.commonRevSet.cumulative) {
      revType = Pers.commonRevSet.name;
    } else if (rand <= Pers.uncommonRevSet.cumulative) {
      revType = Pers.uncommonRevSet.name;
    } else if (rand <= Pers.rareRevSet.cumulative) {
      revType = Pers.rareRevSet.name;
    } else if (rand <= Pers.epicRevSet.cumulative) {
      revType = Pers.epicRevSet.name;
    } else if (rand <= Pers.legendaryRevSet.cumulative) {
      revType = Pers.legendaryRevSet.name;
    } else {
      return;
    }

    let revsOfType = this.getRewsOfType(revType);

    if (revsOfType.length > 0) {
      var rev = revsOfType[Math.floor(Math.random() * revsOfType.length)];

      // То добавляем к наградам
      let idx = this.pers.inventory.findIndex(n => {
        return n.id === rev.id;
      });

      if (idx === -1) {
        rev.count = 1;
        this.pers.inventory.push(rev);
      }
      else {
        this.pers.inventory[idx].count = this.pers.inventory[idx].count + 1;
      }
    }
  }

  private changeLvlAbLogic(tsk: Task, curTaskValue: number, prevTaskVal: number) {
    if (this.pers.isTES) {
      return;
    }
    if (tsk.value >= 2 && !tsk.isSumStates && tsk.states.length > 0) {
      try {
        let nms: number[] = this.getSet(tsk, tsk.states.length);
        let index;
        let prevIdx;

        index = nms[Math.floor(curTaskValue)] - 1;
        prevIdx = nms[Math.floor(prevTaskVal)] - 1;

        if (prevIdx >= 0) {
          tsk.states[index].order = tsk.states[prevIdx].order;
        }
      }
      catch (error) {
      }
    }
  }

  /**
   * Проверка полей персонажа (вдруг новые появились).
   * @param prs Персонаж.
   */
  private checkPersNewFields(prs: Pers) {
    if (prs.expKoef == undefined || prs.expKoef == null) {
      prs.expKoef = 0;
    }

    if (!prs.image) {
      prs.image = prs.rang.img;
    }

    if (!prs.qwests) {
      prs.qwests = [];
    }

    if (prs.isOffline == null || prs.isOffline == undefined) {
      prs.isOffline = false;
    }

    // Настройки
    prs.isTES = false;
    prs.isEra = false;
    prs.isOneLevOneCrist = false;
    prs.isEqLvlUp = true;
    prs.isNoExpShow = true;
    prs.isMax5 = false;
    prs.isNoAbs = false;
    prs.isNoDiary = true;

    if (prs.isNoDiary) {
      return;
    }
    if (!prs.Diary) {
      prs.Diary = [];
    }

    let lastDate: moment.Moment = null;
    let nowDate: moment.Moment = moment().startOf('day');
    if (prs.Diary.length > 0) {
      let first_element = prs.Diary[0];
      lastDate = moment(first_element.date);
    }

    if (lastDate == null) {
      // Добавляем новый
      prs.Diary.unshift(new Diary(moment().startOf('day').toDate(), []));
    }
    else {
      if (lastDate) {
        let first_element = prs.Diary[0];
        if (lastDate.isBefore(nowDate)) {
          while (true) {
            lastDate.add(1, 'day');

            let d = new Diary(lastDate.toDate(), JSON.parse(JSON.stringify(first_element.params)));
            prs.Diary.unshift(d);

            if (lastDate.isSameOrAfter(nowDate)) {
              break;
            }
          }
        }
      }
    }

    // Не больше 28 дней
    if (prs.Diary.length > 28) {
      prs.Diary.splice(28);
    }
  }

  private filterRevs(revType: any) {
    return this.pers.rewards.filter(n => n.rare == revType);
  }

  private getCongrantMsg() {
    return Pers.Inspirations[Math.floor(Math.random() * Pers.Inspirations.length)] + ', ' + this.pers.name + '!';
  }

  private getCurRang(val: number) {
    if (val > this.pers.maxAttrLevel) {
      val = this.pers.maxAttrLevel;
    }
    const rng = new Rangse();
    let vl = Math.floor(val);
    let vlName = '' + Math.floor(val);
    if (this.pers.isTES) {
      vlName = val.toFixed(2);
      vl = +vlName;
    }
    rng.val = vl;
    rng.name = vlName;
    return rng;
  }

  private getFailMsg() {
    return Pers.Abuses[Math.floor(Math.random() * Pers.Abuses.length)] + ', ' + this.pers.name + '!';
  }

  private getMaxTes() {
    return this.pers.maxAttrLevel - 1;
  }

  private getMonsterLevel(prsLvl: number): number {
    if (!this.pers.maxPersLevel || this.pers.maxPersLevel < 100) {
      this.pers.maxPersLevel = 100;
    }
    let max = this.pers.maxPersLevel;
    let progress = prsLvl / max;

    if (progress < 0.1) {
      return 1;
    }
    else if (progress < 0.3) {
      return 2;
    }
    else if (progress < 0.7) {
      return 3;
    }
    else if (progress < 0.9) {
      return 4;
    }
    else {
      return 5;
    }
  }

  private getRewsOfType(revType: any) {
    let revsOfType = this.filterRevs(revType);

    if (revsOfType.length == 0 && revType == Pers.legendaryRevSet.name) {
      revType = Pers.epicRevSet.name;
      revsOfType = this.filterRevs(revType);
    }

    if (revsOfType.length == 0 && revType == Pers.epicRevSet.name) {
      revType = Pers.rareRevSet.name;
      revsOfType = this.filterRevs(revType);
    }

    if (revsOfType.length == 0 && revType == Pers.rareRevSet.name) {
      revType = Pers.uncommonRevSet.name;
      revsOfType = this.filterRevs(revType);
    }

    if (revsOfType.length == 0 && revType == Pers.uncommonRevSet.name) {
      revType = Pers.commonRevSet.name;
      revsOfType = this.filterRevs(revType);
    }

    return revsOfType;
  }

  /**
   * Получает равномерный набор.
   * @param aim 
   * @param result 
   */
  private getSetLinear(aim: number, result: number[], tsk: Task) {
    for (let i = 0; i <= this.pers.maxAttrLevel; i++) {
      let q = i;
      if (this.pers.isTES && q == this.getTVal(tsk)) {
        q = 1 + tsk.tesValue;
      }
      let progr = (q) / (this.pers.maxAttrLevel);

      let val = progr * aim;
      val = Math.ceil(val);

      result.push(val);
    }
  }

  private getTVal(tsk: Task) {
    let tVal = 1 + Math.floor(tsk.tesValue);
    if (tVal > 10) {
      tVal = 10;
    }
    return tVal;
  }

  /**
   * Получает набор с более плавным концом.
   * @param aim 
   * @param result 
   */
  private getSetMaxNeatEnd(aim: number, result: number[], tsk: Task) {
    let max = aim;

    let step = Math.floor(aim / Task.maxValue);
    if (step < 1) {
      step = 1;
    }

    let left = max - step * Task.maxValue;
    if (left < 0) {
      left = 0;
    }
    max = max - left;

    // Основное..
    for (let i = Task.maxValue; i >= 1; i--) {
      result.unshift(max);

      max -= step;

      if (max < step) {
        max = step;
      }
    }

    // Остатки..
    for (let i = 0; i < result.length; i++) {
      let v = i + 1;
      if (v > left) {
        v = left;
      }

      result[i] += v;
    }

    result.unshift(0);
  }

  private getTaskChangesExp(task: Task, isPlus: boolean) {
    const koef = this.getWeekKoef(task.requrense, isPlus, task.tskWeekDays);
    let expKoef = this.getExpKoef(isPlus);
    expKoef = 1;
    if (!isPlus) {
      expKoef = 2;
    }

    expKoef = expKoef * Task.getHardness(task);

    let chVal = this.baseTaskPoints * koef * expKoef;

    if (task.tesValue == null || task.tesValue == undefined) {
      task.tesValue = 0;
    }
    let taskStreang = task.value;
    if (this.pers.isEra) {
      taskStreang = this.getEraCostTotal(task.value);
    }

    // Расчет для ТЕС
    if (this.pers.isTES) {
      let change = 0;
      let tesVal = task.tesValue;

      while (true) {
        let ch: number = 0;
        if (chVal >= 1) {
          ch = 1;
        }
        else {
          ch = chVal;
        }

        change += ch * this.getTesChangeKoef(tesVal);

        if (isPlus) {
          tesVal += change;
        }
        else {
          tesVal -= change;
        }

        chVal -= ch;

        if (chVal <= 0 || tesVal <= 0) {
          break;
        }
      }

      return change;
    }

    let chValFinaly = chVal * Math.floor(taskStreang);

    chValFinaly = Math.ceil(chValFinaly * 10.0) / 10.0;

    return chValFinaly;
  }

  private getTesChangeKoef(tesVal: number): number {
    return (1 / (1 + tesVal));
  }

  private getTskFromState(tsk: Task, st: taskState, isAll: boolean) {
    let stT = new Task();
    let stateProgr;
    //stT.tittle = tsk.name + ': ' + st.name;

    let plusName = tsk.curLvlDescr3;
    if (tsk.requrense == 'нет') {
      plusName = st.name;
    }
    if (tsk.isSumStates) {
      plusName = st.name;
      let pattern = /\d+[⧖|✓].*/;
      let plusTimerOrCounter = pattern.exec(tsk.curLvlDescr3);
      if (plusTimerOrCounter) {
        plusName += ' ' + plusTimerOrCounter;
      }
    }

    if (tsk.isStatePlusTitle) {
      stT.tittle = tsk.name + ': ' + plusName;
    }
    else {
      stT.tittle = plusName;
    }

    if (!isAll) {
      let all = tsk.states.filter(n => n.isActive).length;
      let done = tsk.states.filter(n => n.isActive && n.isDone).length;
      if (all > 1) {
        stateProgr = done + '/' + all;
      }
    }

    stT.name = stT.tittle;
    stT.order = st.order;
    stT.date = tsk.date;
    stT.requrense = tsk.requrense;
    stT.value = tsk.value;
    stT.imageLvl = tsk.imageLvl;
    stT.requrense = tsk.requrense;
    stT.timeVal = st.timeVal;

    //stT.image = tsk.image;
    if (!st.image) {
      this.GetRndEnamy(st);
    }

    stT.id = st.id;
    stT.image = st.image;
    stT.imageLvl = st.imageLvl;
    stT.parrentTask = tsk.id;
    stT.lastNotDone = tsk.lastNotDone;
    stT.plusToNames = [...tsk.plusToNames];

    if (stateProgr) {
      stT.plusToNames.unshift(new plusToName(stateProgr, null, null, ''));
    }

    return stT;
  }

  private setAbRang(ab: Ability) {
    let val = ab.value;
    if (this.pers.isTES) {
      const tesVal = ab.tasks[0].tesValue;
      val = (ab.isOpen ? 1 : 0) + tesVal;
    }
    ab.rang = this.getCurRang(val);
    //ab.rang.name += '%';

    // for (let index = Ability.rangse.length - 1; index >= 0; index--) {
    //   const rang = Ability.rangse[index];
    //   if (ab.value >= rang.val) {
    //     ab.rang = rang;
    //     return;
    //   }
    // }
  }

  private setAbValueAndProgress(ab: Ability, tskCur: number, tskMax: number, tesCur: number) {
    if (tskMax === 0) {
      ab.value = 0;
    }
    else {
      let tskProgr = tskCur / tskMax;
      if (tskProgr > 1) {
        tskProgr = 1;
      }
      ab.value = this.pers.maxAttrLevel * (tskProgr);
    }

    if (ab.value > this.pers.maxAttrLevel) {
      ab.value = this.pers.maxAttrLevel;
    }

    if (ab.value < 0) {
      ab.value = 0;
    }

    // Прогресс навыка
    let abCellValue = Math.floor(ab.value);
    // let abProgress = ab.value - abCellValue;
    // ab.progressValue = abProgress * 100;

    if (this.pers.isTES) {
      ab.progressValue = ((tesCur - Math.floor(tesCur)) /
        ((Math.floor(tesCur) + 1) - Math.floor(tesCur))) * 100;
    }
    else {
      ab.progressValue = (abCellValue / this.pers.maxAttrLevel) * 100;
    }
  }

  private setChaRang(cha: Characteristic) {
    cha.rang = this.getCurRang(cha.value);

    // for (let index = Characteristic.rangse.length - 1; index >= 0; index--) {
    //   const rang = Characteristic.rangse[index];
    //   if (cha.value >= rang.val) {
    //     cha.rang = rang;
    //     return;
    //   }
    // }
  }

  private setChaValueAndProgress(abCur: number, abMax: number, cha: Characteristic, start: number, left: number) {
    let progr = 0
    if (abMax != 0) {
      progr = abCur / abMax;
    }

    cha.value = start + (left * progr);

    if (cha.value > this.pers.maxAttrLevel) {
      cha.value = this.pers.maxAttrLevel;
    }

    if (cha.value < 0) {
      cha.value = 0;
    }
    // Задаем значение прогресса характеристики
    let chaCellValue = Math.floor(cha.value);

    cha.progressValue = (chaCellValue / this.pers.maxAttrLevel) * 100;
  }

  private setCurPersTask() {
    if (this.pers && this.pers.tasks) {
      if (this.pers.currentTaskIndex >= this.pers.tasks.length
        || this.pers.tasks[this.pers.currentTaskIndex] == undefined
        || this.pers.tasks[this.pers.currentTaskIndex] == null) {
        this.pers.currentTaskIndex = 0;
      }
      this.pers.currentTask = this.pers.tasks[this.pers.currentTaskIndex];
    }
  }

  private setPersExpAndAbPoints(chaCur: number, chaMax: number, absCur: number, absMax: number, skillCur: number, skillMax: number, totalAbilities: number) {
    if (this.pers.isTES) {
      let tesPoints = this.pers.characteristics.reduce((a, b) => {
        return a + b.abilities.reduce((a1, b1) => {
          return a1 + b1.tasks[0].tesValue;
        }, 0);
      }, 0);
      this.pers.exp = tesPoints * 33.34;
    }

    // Считаем по развитости всех скиллов
    let maxV = skillMax;

    //let curV = skillCur;

    if (maxV <= 1) {
      maxV = 1;
    }

    let curV = 0;
    this.pers.characteristics.forEach(cha => {
      cha.abilities.forEach(ab => {
        curV += ab.value * Task.getHardness(ab.tasks[0]);
      });
    });

    let onPerLevel;

    if (this.pers.isEra) {
      if (this.pers.isMax5) {
        onPerLevel = (totalAbilities * 15.0) / 100.0;
      }
      else {
        onPerLevel = 10;
      }
    }

    // Очки навыков
    let persLevel = 0;
    let exp: number = 0;
    let startExp = 0;
    let nextExp = 0;
    let startON = 0;
    if (this.pers.isTES) {
      onPerLevel = 1;
      startON = 2;
    }
    else {
      onPerLevel = 1;
      startON = 4;
    }
    this.pers.ONPerLevel = Math.ceil(onPerLevel);
    let ceilOn = 0;

    for (let i = 1; i <= 9999 + 1; i++) {
      startExp = exp;

      if (this.pers.isTES) {
        exp += 100.0;
      }
      else {
        ceilOn = Math.ceil(i * onPerLevel) + startON;

        // Кадые 5 уровней +1 очко
        const oneForFive = Math.trunc((i - 1) / 5);
        ceilOn += oneForFive;

        let noLinear = 1;

        exp += Math.ceil((ceilOn * noLinear) * 10.0) / 10.0;
      }
      nextExp = exp;

      if (exp > this.pers.exp) {
        persLevel = i - 1;

        break;
      }
    }

    let prevPersLevel = this.pers.level;
    this.pers.level = persLevel;
    this.pers.nextExp = nextExp;
    this.pers.prevExp = startExp;

    let lvlExp = nextExp - startExp;
    let progr = 0;
    if (lvlExp != 0) {
      progr = (this.pers.exp - startExp) / lvlExp;
    }

    this.pers.progressValue = progr * 100.0;

    let ons = Math.ceil(ceilOn - curV);

    if (ons < 0) {
      ons = 0;
    }

    this.pers.ON = ons;

    this.pers.totalProgress = (skillCur / skillMax) * 100;

    // Максимальный уровень перса
    let maxPoints = this.pers.characteristics.reduce((a, b) => {
      let withHardness = b.abilities.reduce((c, d) => c + (10 * d.tasks[0].hardnes), 0);
      return a + withHardness;
    }, 0);
    let i = 0;
    while (true) {
      if (i == 0) {
        maxPoints -= 5;
      }
      else if (i % 5 == 0) {
        maxPoints -= 2;
      }
      else {
        maxPoints -= 1;
      }

      i++;

      if (maxPoints <= 0) {
        break;
      }
    }

    this.pers.maxPersLevel = i;

    // debugger;
    // let nnn = this.getMonsterLevel(prevPersLevel);

    if (prevPersLevel != this.pers.level && this.getMonsterLevel(prevPersLevel) != this.getMonsterLevel(this.pers.level)) {
      this.updateQwestTasksImages();
      this.updateAbTasksImages();
    }
  }

  private setPersRang() {
    if (this.pers.rangse.length < 6) {
      let rang = new Rangse();
      rang.img = 'https://live.staticflickr.com/7855/33709082758_52c128029b_o.jpg';
      rang.val = 100;
      rang.name = 'Легенда';
      this.pers.rangse.push(rang);
    }

    let maxLevel = this.pers.characteristics.reduce((a, b) => {
      let withHardness = b.abilities.reduce((c, d) => c + (10 * d.tasks[0].hardnes), 0);
      return a + withHardness;
    }, 0);

    if (maxLevel < 5) {
      maxLevel = 5;
    }

    let step = Math.floor(maxLevel / 5);
    let curRangLvl = 0;
    let nextRangLvl = step;
    let rangIndex = 0;

    for (let i = 0; i < this.pers.rangse.length; i++) {
      curRangLvl = i * step;
      nextRangLvl = (i + 1) * step;

      if (i == this.pers.rangse.length) {
        nextRangLvl = maxLevel;
        rangIndex = this.pers.rangse.length - 1;
        break;
      }

      if (nextRangLvl > this.pers.level) {
        rangIndex = i;
        break;
      }
    }

    this.pers.nextRangLvl = nextRangLvl;

    this.pers.rang = this.pers.rangse[rangIndex];
    this.pers.rang.val = curRangLvl;

    let maxForStory = maxLevel;
    if (maxForStory < 80) {
      maxForStory = 80;
    }

    this.pers.storyProgress = (this.pers.level / maxForStory) * 100;

    // this.pers.nextRangLvl = Pers.rangLvls[Pers.rangLvls.length - 1];

    // for (let index = this.pers.rangse.length - 1; index >= 0; index--) {
    //   this.pers.rangse[index].val = Pers.rangLvls[index];

    //   const rang = this.pers.rangse[index];
    //   if (this.pers.level >= rang.val) {
    //     this.pers.rang = rang;
    //     return;
    //   }

    //   this.pers.nextRangLvl = this.pers.rangse[index].val;
    // }
  }

  private setTaskTittle(tsk: Task) {
    tsk.statesDescr = [];
    tsk.curStateDescrInd = 0;

    if (tsk.aimTimer != 0 || tsk.aimCounter != 0 || tsk.states.length > 0) {
      // Состояния
      if (tsk.states.length > 0) {
        let nms: number[] = this.getSet(tsk, tsk.states.length);

        if (tsk.isStateRefresh) {
          if (tsk.refreshCounter == null && tsk.refreshCounter == undefined) {
            tsk.refreshCounter = 0;
          }
          let cVal = tsk.refreshCounter % tsk.states.length;

          for (let i = 0; i < nms.length; i++) {
            const el = tsk.states[cVal].name;
            if (tsk.statesDescr[i] != undefined) {
              tsk.statesDescr[i] += ' ' + el;
            }
            else {
              tsk.statesDescr.push(el);
            }
          }
        }
        else {
          for (let i = 0; i < nms.length; i++) {
            let j = nms[i] - 1;
            if (j < 0) {
              tsk.statesDescr.push('');
            }
            else {
              if (tsk.isSumStates) {
                let plus = [];
                for (let q = 0; q <= j; q++) {
                  const st = tsk.states[q];

                  plus.push(st.name);
                }

                tsk.statesDescr.push(plus.join('; '));
              }
              else {
                tsk.statesDescr.push(tsk.states[j].name);
              }
            }
          }

          let index = nms[Math.floor(tsk.value)] - 1;
          if (!this.pers.isTES) {
            index = nms[Math.floor(tsk.value)] - 1;
          }
          else {
            index = nms[Math.floor(1 + tsk.tesValue)] - 1;
          }

          if (index >= 0) {
            if (tsk.isSumStates) {
              for (let i = 0; i < tsk.states.length; i++) {
                const el = tsk.states[i];
                if (i <= index) {
                  el.isActive = true;
                }
                else {
                  el.isActive = false;
                }
              }
            }
          }
        }

      }
      // Таймер
      if (tsk.aimTimer != 0) {
        //plusState = ' ' + this.getTskValForState(tsk.value, tsk.aimTimer) + '⧖';

        let nms: number[] = this.getSet(tsk, tsk.aimTimer);

        for (let i = 0; i < nms.length; i++) {
          const el = nms[i];
          if (tsk.statesDescr[i] != undefined) {
            tsk.statesDescr[i] += ' ' + el + '⧖';
          }
          else {
            tsk.statesDescr.push(el + '⧖');
          }
        }
      }
      // Счетчик
      if (tsk.aimCounter != 0) {
        //plusState = ' ' + this.getTskValForState(tsk.value, tsk.aimCounter) + '✓';
        let nms: number[] = this.getSet(tsk, tsk.aimCounter);

        for (let i = 0; i < nms.length; i++) {
          const el = nms[i];
          if (tsk.statesDescr[i] != undefined) {
            tsk.statesDescr[i] += ' ' + el + '✓';
          }
          else {
            tsk.statesDescr.push(el + '✓');
          }
        }
      }

      let stDescr;
      if (!this.pers.isTES) {
        stDescr = tsk.statesDescr[Math.floor(tsk.value)];
      }
      else {
        stDescr = tsk.statesDescr[this.getTVal(tsk)];
      }
      let plusState = stDescr;
      let plusStateMax = tsk.statesDescr[this.pers.maxAttrLevel];
      tsk.plusStateMax = plusStateMax;

      if (plusState) {
        if (tsk.states.length > 0 && !tsk.isSumStates) {
          if (tsk.isStatePlusTitle) {
            tsk.tittle = tsk.name + ': ' + plusState;
          }
          else {
            tsk.tittle = plusState;
          }
        }
        else {
          if (tsk.states.length > 0 && tsk.isStateInTitle) {
            if (tsk.isStatePlusTitle) {
              tsk.tittle = tsk.name + ': ' + plusState;
            }
            else {
              tsk.tittle = plusState;
            }
          }
          else {
            tsk.tittle = tsk.name + ' ' + plusState;
          }
        }
      }
      else {
        tsk.tittle = tsk.name;
      }

      tsk.curLvlDescr = Math.floor(tsk.value) + "" + ' (' + plusState.trim() + ')';
      tsk.curLvlDescr2 = ' (' + plusState.trim() + ')';
      tsk.curLvlDescr3 = plusState.trim();
    }
    else {
      tsk.statesDescr = [];

      for (let i = 0; i <= this.pers.maxAttrLevel; i++) {
        tsk.statesDescr.push('');
      }

      tsk.tittle = tsk.name;
      tsk.curLvlDescr = Math.floor(tsk.value) + "";
      tsk.curLvlDescr2 = '';
    }

    if (tsk.value < 1) {
      tsk.curLvlDescr2 = '';
      tsk.curLvlDescr = '';
    }
  }

  private setTaskValueAndProgress(tsk: Task) {
    if (tsk.value > this.pers.maxAttrLevel + 0.99) {
      tsk.value = this.pers.maxAttrLevel + 0.99;
    }
    if (tsk.value < 0) {
      tsk.value = 0;
    }
    let tv = tsk.value;
    if (this.pers.isTES) {
      tv = tsk.value - 1;
    }
    // Прогресс задачи
    let tskProgress = tv / this.pers.maxAttrLevel;
    if (tskProgress > 1) {
      tskProgress = 1;
    }
    if (this.pers.isTES) {
      tskProgress = (tsk.tesValue - Math.floor(tsk.tesValue)) /
        ((Math.floor(tsk.tesValue) + 1) - Math.floor(tsk.tesValue));
    }
    tsk.progressValue = tskProgress * 100;
  }

  private sortQwestTasks(qw: Qwest) {
    qw.tasks = qw.tasks.sort((a, b) => {
      let aIsDone = 0;
      let bIsDone = 0;
      if (a.isDone) {
        aIsDone = 1;
      }
      if (b.isDone) {
        bIsDone = 1;
      }
      return aIsDone - bIsDone;
    });
  }
}
