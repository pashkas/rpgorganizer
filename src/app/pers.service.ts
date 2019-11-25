import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Pers } from 'src/Models/Pers';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { FirebaseUserModel } from 'src/Models/User';
import { Characteristic } from 'src/Models/Characteristic';
import { Ability } from 'src/Models/Ability';
import { Task, taskState } from 'src/Models/Task';
import { first, take, takeUntil, share, map } from 'rxjs/operators';
import { Qwest } from 'src/Models/Qwest';
import { Reward } from 'src/Models/Reward';
import { plusToName } from 'src/Models/plusToName';
import { Rangse } from 'src/Models/Rangse';
import { Router } from '@angular/router';
import { PerschangesService } from './perschanges.service';
import { EnamiesService } from './enamies.service';

@Injectable({
  providedIn: 'root'
})
export class PersService {
  // Персонаж
  private unsubscribe$ = new Subject();

  baseTaskPoints: number = 1.0;
  isGlobalTaskView: boolean;
  mn0Count: number = 183;
  mn1Count: number = 108;
  mn2Count: number = 211;
  mn3Count: number = 235;
  mn4Count: number = 330;
  mn5Count: number = 156;
  pers: Pers;
  selTabPersList: number = 0;
  // Пользователь
  user: FirebaseUserModel;

  constructor(public db: AngularFirestore, private router: Router, private changes: PerschangesService, private enmSrv: EnamiesService) {
  }

  /**
   * Добавить новую награду.
   * @param newRev Название награды.
   * @param probability Вероятность получения.
   * @param descr Описание.
   */
  AddRevard(newRev: string, probability: number, descr: string): any {
    var rev = new Reward();
    rev.name = newRev;
    rev.probability = probability;
    rev.descr = descr;
    this.pers.rewards.push(rev);
    this.countToatalRewProb();
  }

  /**
   * Проверка и задание даты для задачи.
   * @param tsk Задача.
   */
  CheckSetTaskDate(tsk: Task): any {
    let tDate = new Date(tsk.date);

    while (true) {
      if (this.checkDate(tDate, tsk.requrense)) {
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

    this.delQwest(qw.id);

    this.savePers(true);
  }

  GetRndEnamy(tsk: Task): string {
    let lvl = tsk.value * 10.0;//this.pers.level;
    if (tsk.requrense == 'нет') {
      lvl = this.pers.level;
    }

    if (lvl >= 90) {
      if (this.pers.Monsters5Queue == null || this.pers.Monsters5Queue == undefined) {
        this.pers.Monsters5Queue = 0;
      }
      if (this.pers.Monsters5Queue > this.mn5Count) {
        this.pers.Monsters5Queue = 0;
      }

      let path = this.getImgPath(this.pers.Monsters5Queue, 5);
      this.pers.Monsters5Queue++;

      tsk.imageLvl = '5';

      return path;
    }
    if (lvl >= 80) {
      if (this.pers.Monsters4Queue == null || this.pers.Monsters4Queue == undefined) {
        this.pers.Monsters4Queue = 0;
      }
      if (this.pers.Monsters4Queue > this.mn4Count) {
        this.pers.Monsters4Queue = 0;
      }

      let path = this.getImgPath(this.pers.Monsters4Queue, 4);
      this.pers.Monsters4Queue++;

      tsk.imageLvl = '4';

      return path;
    }
    if (lvl >= 60) {
      if (this.pers.Monsters3Queue == null || this.pers.Monsters3Queue == undefined) {
        this.pers.Monsters3Queue = 0;
      }
      if (this.pers.Monsters3Queue > this.mn3Count) {
        this.pers.Monsters3Queue = 0;
      }

      let path = this.getImgPath(this.pers.Monsters3Queue, 3);
      this.pers.Monsters3Queue++;

      tsk.imageLvl = '3';

      return path;
    }
    if (lvl >= 40) {
      if (this.pers.Monsters2Queue == null || this.pers.Monsters2Queue == undefined) {
        this.pers.Monsters2Queue = 0;
      }
      if (this.pers.Monsters2Queue > this.mn2Count) {
        this.pers.Monsters2Queue = 0;
      }

      let path = this.getImgPath(this.pers.Monsters2Queue, 2);
      this.pers.Monsters2Queue++;

      tsk.imageLvl = '2';

      return path;
    }
    if (lvl >= 20) {
      if (this.pers.Monsters1Queue == null || this.pers.Monsters1Queue == undefined) {
        this.pers.Monsters1Queue = 0;
      }
      if (this.pers.Monsters1Queue > this.mn1Count) {
        this.pers.Monsters1Queue = 0;
      }

      let path = this.getImgPath(this.pers.Monsters1Queue, 1);
      this.pers.Monsters1Queue++;

      tsk.imageLvl = '1';

      return path;
    }

    if (this.pers.Monsters0Queue == null || this.pers.Monsters0Queue == undefined) {
      this.pers.Monsters0Queue = 0;
    }
    if (this.pers.Monsters0Queue > this.mn0Count) {
      this.pers.Monsters0Queue = 0;
    }

    let path = this.getImgPath(this.pers.Monsters0Queue, 0);
    this.pers.Monsters0Queue++;

    tsk.imageLvl = '0';

    return path;

    // let lvl = tsk.value * 10.0;//this.pers.level;
    // if (tsk.requrense == 'нет') {
    //   lvl = this.pers.level;
    // }

    // if (lvl >= 90) {
    //   return Pers.Enamies5[Math.floor(Math.random() * Pers.Enamies5.length)].image;
    // }
    // if (lvl >= 80) {
    //   return Pers.Enamies4[Math.floor(Math.random() * Pers.Enamies4.length)].image;
    // }
    // if (lvl >= 60) {
    //   return Pers.Enamies3[Math.floor(Math.random() * Pers.Enamies3.length)].image;
    // }
    // if (lvl >= 40) {
    //   return Pers.Enamies2[Math.floor(Math.random() * Pers.Enamies2.length)].image;
    // }
    // if (lvl >= 20) {
    //   return Pers.Enamies1[Math.floor(Math.random() * Pers.Enamies1.length)].image;
    // }

    // return Pers.Enamies0[Math.floor(Math.random() * Pers.Enamies0.length)].image;
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
  addQwest(newQwest: string): any {
    let qwest = new Qwest();
    qwest.name = newQwest;

    this.pers.qwests.push(qwest);
  }

  /**
   * Добавить новую задачу к навыку
   * @param abil Навык.
   * @param newTsk Название задачи.
   */
  addTsk(abil: Ability, newTsk: string): any {
    var tsk = new Task();
    tsk.name = newTsk;

    tsk.image = this.GetRndEnamy(tsk);
    tsk.states.forEach(st => {
      st.img = this.GetRndEnamy(tsk);
    });

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

    tsk.image = this.GetRndEnamy(tsk);

    tsk.requrense = "нет";
    qwest.tasks.push(tsk);

    this.sortQwestTasks(qwest);
  }

  changesAfter(isGood) {
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
  checkDate(tDate: Date, requrense: string): any {
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
    }
    else if (requrense === "выходные") {
      if (weekDay === 6
        || weekDay === 0) {
        return true;
      }
    }
    else if (requrense === "пн,ср,пт") {
      if (weekDay === 1
        || weekDay === 3
        || weekDay === 5) {
        return true;
      }
    }
    else if (requrense === "вт,чт,сб") {
      if (weekDay === 2
        || weekDay === 4
        || weekDay === 6) {
        return true;
      }
    }
    else if (requrense === "пн,вт,чт,сб") {
      if (weekDay === 1
        || weekDay === 2
        || weekDay === 4
        || weekDay === 6) {
        return true;
      }
    }
    else if (requrense === "не суббота") {
      if (weekDay != 6) {
        return true;
      }
    }
    else if (requrense === "не воскресенье") {
      if (weekDay != 7) {
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
    this.pers.characteristics.forEach(cha => {
      cha.abilities.forEach(ab => {
        ab.tasks.forEach(tsk => {
          if (tsk.id === id) {
            task = tsk;
            abil = ab;
          }
        });
      });
    });
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
        if (ab.value >= 1) {
          ab.tasks.forEach(tsk => {
            if (tsk.states.length > 0 && tsk.isSumStates) {
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
    return this.db.collection<Pers>('/pers', ref => ref.where('level', '>=', 1).orderBy('level', 'desc'))
      .valueChanges()
      .pipe(
        map(champ => champ.map(n => {
          return { Name: n.name, Level: n.level, Pic: n.rang.img, Id: n.id };
        })),
        take(1),
        share()
      );
  }

  getImgPath(num: number, lvl: number): string {
    let result: string = ''; //'assets/img/' + lvl + '/';

    let ss = '000' + num;
    ss = ss.substr(ss.length - 3);

    result += ss; // + '.jpg';

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
          const pers = data;
          const prs = (pers as Pers);

          if (prs.tasks && prs.tasks.length > 0) {
            prs.currentTaskIndex = 0;
            prs.currentTask = prs.tasks[0];
          }

          this.checkPersNewFields(prs);

          this.pers = prs;

          if (this.checkNullOrUndefined(this.pers.prevOrderSeq)
            || this.checkNullOrUndefined(this.pers.curOrderSeq)
            || this.checkNullOrUndefined(this.pers.curEndOfListSeq)
          ) {
            this.pers.prevOrderSeq = 0;
            this.pers.curOrderSeq = 0;
            this.pers.curEndOfListSeq = 9999;
          }

          // Если наступил следующий день, меняем счетчики
          let curDate = new Date().setHours(0, 0, 0, 0);
          let lastUse = new Date(this.pers.dateLastUse).setHours(0, 0, 0, 0);
          if (curDate.valueOf() > lastUse.valueOf()) {
            this.pers.prevOrderSeq = this.pers.curOrderSeq;
            this.pers.curOrderSeq = 0;
            this.pers.curEndOfListSeq = 9999;

            this.savePers(false);
          }
        }
        // Если перса пока что не было
        else if (data === undefined && usr.id != undefined) {
          const pers = new Pers();
          pers.userId = usr.id;
          pers.id = usr.id;

          this.checkPersNewFields(pers);

          this.pers = pers;
        }
      });
  }

  getSet(tsk: Task, aim: number): number[] {
    let result: number[] = [];

    for (let i = 0; i <= Task.maxValue; i++) {
      let progr = i / Task.maxValue;
      result.push(Math.ceil(progr * aim));
    }

    // let max = aim;

    // let step = Math.floor(aim / Task.maxValue);
    // if (step < 1) {
    //   step = 1;
    // }

    // let left = max - step * Task.maxValue;
    // if (left < 0) {
    //   left = 0;
    // }
    // max = max - left;

    // // Основное..
    // for (let i = Task.maxValue; i >= 1; i--) {
    //   result.unshift(max);

    //   max -= step;

    //   if (max < step) {
    //     max = step;
    //   }
    // }

    // // Остатки..
    // for (let i = 0; i < result.length; i++) {
    //   let v = i + 1;
    //   if (v > left) {
    //     v = left;
    //   }

    //   result[i] += v;
    // }

    // result.unshift(0);

    return result;
  }

  getTskValForState(value: number, maxValue: number) {
    let progres = (Math.floor(value)) / (+Task.maxValue);
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
  getWeekKoef(requrense: string, isPlus: boolean): number {
    if (requrense === 'будни') {
      return 7.0 / 5.0;
    }
    if (requrense === 'выходные') {
      return 7.0 / 2.0;
    }
    if (requrense === 'ежедневно') {
      return 7.0 / 7.0;
    }
    if (requrense === 'пн,ср,пт') {
      return 7.0 / 3.0;
    }
    if (requrense === 'вт,чт,сб') {
      return 7.0 / 3.0;
    }
    if (requrense === 'пн,вт,чт,сб') {
      return 7.0 / 4.0;
    }
    if (requrense === 'не суббота') {
      return 7.0 / 6.0;
    }
    if (requrense === 'не воскресенье') {
      return 7.0 / 6.0;
    }
    if (isPlus) {
      if (requrense === 'через 1 день') {
        return 2;
      }
      if (requrense === 'через 2 дня') {
        return 3;
      }
      if (requrense === 'через 3 дня') {
        return 4;
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

  saveGlobalTaskViewState(b: boolean) {
    this.isGlobalTaskView = b;
  }

  /**
   * Записать персонажа в БД.
   */
  savePers(isShowNotif: boolean, plusOrMinus?): any {
    let totalAbils: number = 0;

    this.pers.dateLastUse = new Date();

    let chaMax = 0;
    let chaCur = 0;
    let abCurTotal = 0;
    let abMaxTotal = 0;
    let skillCur = 0;
    let skillMax = 0;

    this.pers.characteristics.forEach(cha => {
      let abMax = 0, abCur = 0;
      cha.abilities.forEach(ab => {
        let tskMax = 0;
        let tskCur = 0;
        totalAbils += 1;

        // Если задач нет - все равно учитываем
        if (ab.tasks.length == 0) {
          skillCur += 0;
          skillMax += Task.maxValue;
        }

        ab.tasks.forEach(tsk => {
          tsk.plusToNames = [];
          tsk.plusToNames.push(new plusToName(cha.name, cha.id, '/characteristic'));

          let exp = Math.floor(tsk.value) * this.getWeekKoef(tsk.requrense, true) * 10.0;
          exp = Math.floor(exp);

          tsk.plusToNames.unshift(new plusToName('+' + exp + ' exp', null, null));

          if (tsk.descr) {
            tsk.plusToNames.push(new plusToName(tsk.descr, '', ''));
          }
          this.setTaskValueAndProgress(tsk);
          this.setTaskTittle(tsk);
          this.CheckSetTaskDate(tsk);
          tskMax += Task.maxValue;
          tskCur += tsk.value <= Task.maxValue ? tsk.value : Task.maxValue;

          let koef = tsk.isHard ? 2.0 : 1.0;

          if (Pers.GameSettings.isTesExp) {
            skillCur += Math.floor(tsk.value) * koef;
          }
          else {
            skillCur += tsk.value * koef;
          }

          skillMax += Task.maxValue * koef;
        });

        this.setAbValueAndProgress(ab, tskCur, tskMax);
        this.setAbRang(ab);

        abMax += Ability.maxValue;
        abMaxTotal += Ability.maxValue;
        if (Pers.GameSettings.isTesExp) {
          abCur += Math.floor(ab.value);
          abCurTotal += Math.floor(ab.value);
        }
        else {
          abCur += ab.value;
          abCurTotal += ab.value;
        }
      });

      let start = cha.startRang.val;
      let max = Characteristic.maxValue;
      let left = max - start;

      this.setChaValueAndProgress(abCur, abMax, cha, start, left);
      this.setChaRang(cha);

      // Награды
      // Общая вероятность награды
      this.countToatalRewProb();
      this.countRewProbCumulative();

      chaMax += Characteristic.maxValue - start;
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
        tsk.plusToNames.push(new plusToName(qw.name, qw.id, '/qwest'));
        if (tsk.descr) {
          tsk.plusToNames.push(new plusToName(tsk.descr, '', ''));
        }
      });

      if (totalTsks > 0) {
        qw.progressValue = (doneTsks / totalTsks) * 100.0;
      }
      else {
        qw.progressValue = 0;
      }

      // Сортировка задач квеста
      this.sortQwestTasks(qw);
    });

    // Сортировка квестов по прогрессу
    // this.pers.qwests = this.pers.qwests.sort((a, b) => {
    //   return (b.progressValue - a.progressValue);
    //   //return a.name.localeCompare(b.name);
    // });

    // this.setPersExp(chaCur, chaMax);
    this.setPersExpAndON(chaCur, chaMax, abCurTotal, abMaxTotal, skillCur, skillMax, totalAbils); // Опыт чисто по навыкам
    this.setPersRang();

    // Прогресс ранга
    let curLvl = this.pers.level;
    let cur = curLvl - this.pers.rang.val;
    let tot = this.pers.nextRangLvl - this.pers.rang.val;
    if (tot === 0) {
      tot = 1;
    }

    this.pers.rangProgress = (cur / tot) * 100;

    // Сортировка характеристик
    this.pers.characteristics
      = this.pers.characteristics.sort((a, b) => {
        const aVal = Math.floor(a.value);
        const bVal = Math.floor(b.value);

        if (aVal != bVal) {
          return -(a.value - b.value);
        }

        return a.name.localeCompare(b.name);
      });
    // Сортировка навыков
    this.pers.characteristics.forEach(cha => {
      cha.abilities = cha.abilities.sort((a, b) => {
        if (a.value != b.value) {
          return -(a.value - b.value);
        }

        return a.name.localeCompare(b.name);
      });
    });

    let tasks: Task[] = this.getPersTasks();

    this.sortPersTasks(tasks);

    this.setCurPersTask();

    this.db.collection('pers').doc(this.pers.id)
      .set(JSON.parse(JSON.stringify(this.pers)));
  }

  setCurInd(i: number): any {
    this.pers.currentTaskIndex = i;
    this.pers.currentTask = this.pers.tasks[i];
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
        this.router.navigate(['/task', tsk.id]);
      }
    }
    else {
      this.router.navigate(['/ability', ab.id]);
    }
  }

  checkUpdateTaskImage(t: Task) {
    let id;

    if (t.parrentTask) {
      id = t.parrentTask;
    }
    else {
      id = t.id;
    }

    let task: Task;
    let abil: Ability;

    ({ task, abil } = this.findTaskAnAb(id, task, abil));

    if (task) {
      task.image = this.GetRndEnamy(task);
      task.states.forEach(st => {
        st.img = this.GetRndEnamy(task);
      });
    }
    else {
      for (let index = 0; index < this.pers.qwests.length; index++) {
        const qw = this.pers.qwests[index];
        qw.tasks.forEach(tsk => {
          if (tsk.id === id) {
            task = tsk;
          }
        });
      }

      if (task) {
        task.image = this.GetRndEnamy(task);
      }
    }

    this.savePers(false);
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
      // this.setTaskOrder(task, false, false);
      // if (task.lastNotDone) {
      //   task.order = 999;
      // }

      // Следующая дата
      this.setTaskNextDate(task, false);
      this.setStatesNotDone(task);

      // Плюсуем значение
      let chVal = this.baseTaskPoints * this.getWeekKoef(task.requrense, false);
      //Task.valueDecrease(chVal, task, this.pers.level);
      this.pers.exp -= chVal * Math.floor(task.value);
      if (this.pers.exp < 0) {
        this.pers.exp = 0;
      }

      task.lastNotDone = true;

      task.image = this.GetRndEnamy(task);
      task.states.forEach(st => {
        st.img = this.GetRndEnamy(task);
      });

      this.setCurInd(0);
      this.savePers(true, 'minus');

      return 'навык';
    }
  }

  /**
   * Клик плюс по задаче.
   * @param id Идентификатор задачи.
   */
  taskPlus(id: string) {
    // Разыгрываем награды
    this.CasinoRevards();

    // Находим задачу
    let task: Task;
    let abil: Ability;

    ({ task, abil } = this.findTaskAnAb(id, task, abil));
    if (task) {
      // Следующая дата
      this.setTaskNextDate(task, true);
      this.setStatesNotDone(task);

      // Плюсуем значение
      let chVal = this.baseTaskPoints * this.getWeekKoef(task.requrense, true);
      //Task.valueIncrease(chVal, task, this.pers.level);
      this.pers.exp += chVal * Math.floor(task.value);

      task.image = this.GetRndEnamy(task);
      task.states.forEach(st => {
        st.img = this.GetRndEnamy(task);
      });

      task.lastNotDone = false;
      this.setCurInd(0);
      this.savePers(true, 'plus');
      //this.inspirationToastShow();

      return 'навык';
    }
    // Ищем в квестах
    for (let index = 0; index < this.pers.qwests.length; index++) {
      const qw = this.pers.qwests[index];
      qw.tasks.forEach(tsk => {
        if (tsk.id === id) {
          task = tsk;
          this.pers.currentQwestId = qw.id;

          this.pers.qwests.unshift(this.pers.qwests.splice(index, 1)[0]);
        }
      });
    }

    if (task) {
      task.isDone = true;
      //this.setTaskOrder(task, true, false);
      this.savePers(true, 'plus');

      return 'квест';
    }
  }

  upAbility(ab: Ability) {
    let isOpenForEdit = false;

    for (let i = 0; i < ab.tasks.length; i++) {
      const tsk: Task = ab.tasks[i];

      if (tsk.value < 1) {
        tsk.date = new Date();
      }

      if (tsk.value == 0) {
        isOpenForEdit = true;
      }

      tsk.value += 1;

      tsk.image = this.GetRndEnamy(tsk);
      tsk.states.forEach(st => {
        st.img = this.GetRndEnamy(tsk);
      });
    }

    this.savePers(true, 'plus');

    // Переходим в настройку навыка, если это первый уровень
    if (isOpenForEdit) {
      this.showAbility(ab);
    }
  }

  /**
   * Розыгрыш наград.
   */
  private CasinoRevards() {
    for (let i = 0; i < this.pers.rewards.length; i++) {
      let rand = Math.random() * 100.0;
      let el = this.pers.rewards[i];

      if (rand <= el.probability) {
        // То добавляем к наградам
        let idx = this.pers.inventory.findIndex(n => {
          return n.id === el.id;
        });

        if (idx === -1) {
          el.count = 1;
          this.pers.inventory.push(el);
        }
        else {
          this.pers.inventory[idx].count = this.pers.inventory[idx].count + 1;
        }
      }
    }

    // for (let index = 0; index < this.pers.rewards.length; index++) {
    //   const r = this.pers.rewards[index];

    //   if (!r.cumulative) {
    //     this.countRewProbCumulative();
    //   }

    //   if (rand < r.cumulative) {
    //     // То добавляем к наградам
    //     let idx = this.pers.inventory.findIndex(n => {
    //       return n.id === r.id;
    //     });

    //     if (idx === -1) {
    //       r.count = 1;
    //       this.pers.inventory.push(r);
    //     }
    //     else {
    //       this.pers.inventory[idx].count = this.pers.inventory[idx].count + 1;
    //     }

    //     let t = this.toastr.success(r.name, 'Получен трофей!');
    //     this.closeToast(t);

    //     break;
    //   }
    // }
  }

  // private addTaskDescrState(rang: Rangse, tsk: Task) {
  //   let state: taskState = new taskState();
  //   state.abRang = rang;
  //   state.name = "";
  //   tsk.statesDescr.push(state);
  // }

  /**
   * Проверка полей персонажа (вдруг новые появились).
   * @param prs Персонаж.
   */
  private checkPersNewFields(prs: Pers) {
    if (!prs.qwests) {
      prs.qwests = [];
    }
  }

  private getCongrantMsg() {
    return Pers.Inspirations[Math.floor(Math.random() * Pers.Inspirations.length)] + '!';
  }

  private getCurRang(val: number) {
    const rng = new Rangse();
    rng.val = Math.floor(val);
    rng.name = '' + Math.floor(val);
    return rng;
  }

  private getFailMsg() {
    return Pers.Abuses[Math.floor(Math.random() * Pers.Abuses.length)] + '!';
  }

  private getPersTasks() {
    let tasks: Task[] = [];

    // Задачи навыков
    if (!this.pers.sellectedView || this.pers.sellectedView === "навыки") {
      this.pers.characteristics.forEach(cha => {
        cha.abilities.forEach(ab => {
          if (ab.value >= 1) {
            ab.tasks.forEach(tsk => {
              if (this.checkTask(tsk)) {
                if (tsk.isSumStates && tsk.states.length > 0) {
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
      this.pers.qwests.forEach(qw => {
        for (let index = 0; index < qw.tasks.length; index++) {
          const tsk = qw.tasks[index];
          if (!tsk.isDone) {
            if (this.checkTask(tsk)) {
              tasks.push(tsk);
              if (qw.id === this.pers.currentQwestId) {
                this.setCurInd(tasks.indexOf(tsk));
              }
            }
            break;
          }
        }
      });
    }

    return tasks;
  }

  private getTskFromState(tsk: Task, st: taskState, isAll: boolean) {
    let stT = new Task();
    let stateProgr;
    //stT.tittle = tsk.name + ': ' + st.name;
    stT.tittle = st.name;

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

    //stT.image = tsk.image;
    if (!st.img) {
      st.img = this.GetRndEnamy(tsk);
    }
    stT.image = st.img;
    stT.imageLvl = tsk.imageLvl;

    stT.id = st.id;
    stT.parrentTask = tsk.id;
    stT.lastNotDone = tsk.lastNotDone;
    stT.plusToNames = [...tsk.plusToNames];

    if (stateProgr) {
      stT.plusToNames.unshift(new plusToName(stateProgr, null, null));
    }

    return stT;
  }

  private setAbRang(ab: Ability) {
    ab.rang = this.getCurRang(ab.value);
    //ab.rang.name += '%';

    // for (let index = Ability.rangse.length - 1; index >= 0; index--) {
    //   const rang = Ability.rangse[index];
    //   if (ab.value >= rang.val) {
    //     ab.rang = rang;
    //     return;
    //   }
    // }
  }

  private setAbValueAndProgress(ab: Ability, tskCur: number, tskMax: number) {
    if (tskMax === 0) {
      ab.value = 0;
    }
    else {
      let tskProgr = tskCur / tskMax;
      if (tskProgr > 1) {
        tskProgr = 1;
      }
      ab.value = Ability.maxValue * (tskProgr);
    }

    if (ab.value > Ability.maxValue) {
      ab.value = Ability.maxValue;
    }

    if (ab.value < 0) {
      ab.value = 0;
    }

    // Прогресс навыка
    let abCellValue = Math.floor(ab.value);
    // let abProgress = ab.value - abCellValue;
    // ab.progressValue = abProgress * 100;
    ab.progressValue = (abCellValue / Ability.maxValue) * 100;
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
    if (cha.value > Characteristic.maxValue) {
      cha.value = Characteristic.maxValue;
    }
    if (cha.value < 0) {
      cha.value = 0;
    }
    // Задаем значение прогресса характеристики
    let chaCellValue = Math.floor(cha.value);
    // let chaProgress = (cha.value - chaCellValue) / 1.0;
    // cha.progressValue = chaProgress * 100;
    cha.progressValue = (chaCellValue / Characteristic.maxValue) * 100;
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

  private setPersExpAndON(chaCur: number, chaMax: number, absCur: number, absMax: number, skillCur: number, skillMax: number, totalAbilities: number) {
    // Считаем по развитости всех скиллов
    let maxV = skillMax;
    let curV = skillCur;

    if (maxV <= 1) {
      maxV = 1;
    }

    // Очки навыков
    this.pers.ONPerLevel = totalAbilities / Ability.maxValue;

    let persLevel = 0;

    let exp: number = 0;
    let startExp = 0;
    let nextExp = 0;

    for (let i = 1; i < Pers.maxLevel; i++) {
      startExp = exp;
      exp += Math.ceil(i * this.pers.ONPerLevel);
      nextExp = exp;
      if (exp >= this.pers.exp) {
        persLevel = i - 1;
        break;
      }
    }

    this.pers.level = persLevel;
    this.pers.nextExp = nextExp;

    let lvlExp = nextExp - startExp;
    let progr = (this.pers.exp - startExp) / lvlExp;
    this.pers.progressValue = progr * 100.0;

    let ons = Math.ceil(((this.pers.level + 1) * this.pers.ONPerLevel) - curV);
    // let persProgress = curV / maxV;
    // const lvl = Pers.maxLevel * persProgress;
    // let totalExp = lvl * 1000;
    // this.pers.exp = totalExp;
    // this.pers.level = Math.floor(lvl);
    // this.pers.progressValue = (lvl - Math.floor(lvl)) * 100.0;

    if (ons < 0) {
      ons = 0;
    }

    this.pers.ON = ons;
  }

  private setPersRang() {
    if (this.pers.rangse.length < 6) {
      let rang = new Rangse();
      rang.img = 'https://live.staticflickr.com/7855/33709082758_52c128029b_o.jpg';
      rang.val = 100;
      rang.name = 'Легенда';
      this.pers.rangse.push(rang);
    }

    this.pers.nextRangLvl = Pers.rangLvls[Pers.rangLvls.length - 1];

    for (let index = this.pers.rangse.length - 1; index >= 0; index--) {
      this.pers.rangse[index].val = Pers.rangLvls[index];

      const rang = this.pers.rangse[index];
      if (this.pers.level >= rang.val) {
        this.pers.rang = rang;
        return;
      }

      this.pers.nextRangLvl = this.pers.rangse[index].val;
    }
  }

  private setTaskTittle(tsk: Task) {
    tsk.statesDescr = [];
    tsk.curStateDescrInd = 0;

    if (tsk.aimTimer != 0 || tsk.aimCounter != 0 || tsk.states.length > 0) {
      // Счетчик
      if (tsk.aimCounter != 0) {
        //plusState = ' ' + this.getTskValForState(tsk.value, tsk.aimCounter) + '✓';
        let nms: number[] = this.getSet(tsk, tsk.aimCounter);

        for (let i = 0; i < nms.length; i++) {
          const el = nms[i];
          tsk.statesDescr.push(el + '✓');
        }
      }
      // Таймер
      else if (tsk.aimTimer != 0) {
        //plusState = ' ' + this.getTskValForState(tsk.value, tsk.aimTimer) + '⧖';
        let nms: number[] = this.getSet(tsk, tsk.aimTimer);

        for (let i = 0; i < nms.length; i++) {
          const el = nms[i];
          tsk.statesDescr.push(el + '⧖');
        }
      }
      // Состояния
      else if (tsk.states.length > 0) {
        let nms: number[] = this.getSet(tsk, tsk.states.length);

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

      let plusState = tsk.statesDescr[Math.floor(tsk.value)];

      if (plusState) {
        tsk.tittle = tsk.name + ' ' + plusState;
      }
      else {
        tsk.tittle = tsk.name;
      }

      tsk.curLvlDescr = Math.floor(tsk.value) + "" + ' (' + plusState.trim() + ')';
      tsk.curLvlDescr2 = ' (' + plusState.trim() + ')';
    }
    else {
      tsk.statesDescr = [];

      for (let i = 0; i <= Task.maxValue; i++) {
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
    if (tsk.value > Task.maxValue + 0.99) {
      tsk.value = Task.maxValue + 0.99;
    }
    if (tsk.value < 0) {
      tsk.value = 0;
    }
    // Прогресс задачи
    let tskProgress = tsk.value / Task.maxValue;
    if (tskProgress > 1) {
      tskProgress = 1;
    }
    tsk.progressValue = tskProgress * 100;
  }

  private sortPersTasks(tasks: Task[]) {
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
