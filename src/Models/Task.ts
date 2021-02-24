import { v4 as uuid } from 'uuid';
import { Time } from '@angular/common';
import { Rangse } from './Rangse';
import { Pers } from './Pers';
import { plusToName } from './plusToName';
export class Task implements IImg {
    reqvirements: Reqvirement[] = [];

    static maxValue: number = 10;
    static requrenses: string[] = [
        "будни",
        "выходные",
        "ежедневно",
        "дни недели",
        "через 1 день",
        "через 2 дня",
        "через 3 дня",
        "нет",
    ];

    static weekDays: string[] =
        [
            "пн",
            "вт",
            "ср",
            "чт",
            "пт",
            "сб",
            "вс",
        ];

    tskWeekDays: string[] = []; //[...Task.weekDays];

    aimCounter: number = 0;
    aimTimer: number = 0;

    curStateDescrInd: number;
    statesDescr: string[] = [];

    hardnes: number = 1;

    date: Date = this.getNowDate();
    descr: string = "";
    id: any = uuid();
    image: string = "";
    isDone: boolean = false;

    // Таймер/счетчик
    isCounter:boolean=false;
    counterValue:number=0;
    isTimer:boolean=false;
    timerStart:Date;
    timerValue:number=0;
    /**
     * Суммирование состояний.
     */
    isSumStates: boolean = false;
    name: string;
    plusName: string;
    plusToNames: plusToName[] = [];
    isStatePlusTitle: boolean = true;
    isStateRefresh: boolean = false;
    refreshCounter: number = 0;
    isStateInTitle: boolean = false;
    progressValue: number = 0;
    requrense: string = "будни";
    states: taskState[] = [];
    // statesDescr: taskState[] = [];
    time: string = "00:00";
    timeForSort: number = 200000000;
    tittle: string;
    value: number = 0;
    order: number = -1;
    lastNotDone: boolean = false;
    isfrstqwtsk: boolean;
    isHard: boolean = false;

    parrentTask: string;
    curLvlDescr: string;
    curLvlDescr2: string;
    imageLvl: string = '0';
    IsNextLvlSame: boolean;
    isPerk: boolean = false;
    mayUp: boolean;
    cost: number = 0;
    nextUp: number = 0;
    tesValue: number = 0;
    roundVal: number = 0;
    plusStateMax: string;
    timeVal: number;
    curLvlDescr3: string;

    static getHardness(tsk: Task): number {
        if (!tsk.hardnes) {
            tsk.hardnes = 1;
        }
        
        return tsk.hardnes;
    }

    /**
     * Получить формулу для роста/понижения значения задачи.
     * @param curVal Значение.
     */
    static AbIncreaseFormula(curVal: number, persLvl: number, isHard): any {
        let abIncreaseFormula = 1;

        let hardKoef = 1;

        if (isHard) {
            hardKoef = 2;
        }

        let val = (Math.floor(curVal) / 10.0) + 1;
        abIncreaseFormula = val * hardKoef;

        return 1 / abIncreaseFormula;
    }

    /**
     * Получить значение следующего уровня задачи.
     * @param value Значение.
     */
    static GetNextLvl(value: number): any {
        return Math.floor(value) + 1;
    }

    /**
     * Уменьшение значения задачи.
     * @param chVal Изменение значения.
     */
    static valueDecrease(chVal: number, tsk: Task, prsLvl: number): any {
        let curVal = tsk.value;

        if (chVal && isFinite(chVal)) {
            // Если формула - в зависимости от развитости навыков
            while (true) {
                let prevLvl = Math.floor(curVal);

                if (prevLvl == curVal)
                    prevLvl = prevLvl - 1;

                let lastForPrev = curVal - prevLvl;
                let change = chVal * this.AbIncreaseFormula(prevLvl, prsLvl, tsk.isHard);

                if (change <= lastForPrev) {
                    curVal -= change;
                    break;
                }

                let iterationChange = lastForPrev / this.AbIncreaseFormula(prevLvl, prsLvl, tsk.isHard);
                chVal -= iterationChange;
                curVal -= lastForPrev;

                if (curVal <= 0) {
                    curVal = 0;
                    break;
                }
            }
        }

        tsk.value = curVal;
    }

    /**
     * Прирост значения задачи.
     * @param chVal Изменение значения.
     */
    static valueIncrease(chVal: number, tsk: Task, prsLvl: number): any {
        let curVal = tsk.value;

        if (chVal && isFinite(chVal)) {
            // Если формула - в зависимости от развитости навыков
            while (true) {
                let nextLvl = this.GetNextLvl(curVal);
                let lastForNext = nextLvl - curVal;
                let change = chVal * this.AbIncreaseFormula(curVal, prsLvl, tsk.isHard);

                if (change <= lastForNext) {
                    curVal += change;
                    break;
                }

                let iterationChange = lastForNext / this.AbIncreaseFormula(curVal, prsLvl, tsk.isHard);
                chVal -= iterationChange;
                curVal += lastForNext;
            }
        }

        tsk.value = curVal;
    }

    /**
     * Получить дату для новой задачи.
     */
    private getNowDate(): Date {
        var today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59);
    }
}

export class taskState implements IImg {
    abRang: Rangse;
    id: any = uuid();
    name: string;

    isDone: boolean = false;
    parrentTask: string;
    isActive: boolean = false;
    startLvl: number = 999;
    order: number = -1;
    img: string;
    image: string;
    imageLvl: string = '0';

    value: number;
    requrense: string;
    timeVal: number;
}

export interface IImg {
    image: string;
    imageLvl: string;
    value: number;
    requrense: string;
}

export class Reqvirement {
    id: any = uuid();
    elId: any;
    elVal: number;
    elName: string;
    isDone: boolean = false;
}