import { Injectable } from '@angular/core';
import { Task } from 'src/Models/Task';

@Injectable({
  providedIn: 'root'
})
export class EnamiesService {

  mn0Count: number = 10;
  mn1Count: number = 10;
  mn2Count: number = 10;
  mn3Count: number = 10;
  mn4Count: number = 10;
  mn5Count: number = 10;

  constructor() { }

  GetRndEnamy(tsk: Task, persLevel: number, mn0: number, mn1: number, mn2: number, mn3: number, mn4: number, mn5: number): string {
    let lvl = tsk.value * 10.0;//this.pers.level;
    if (tsk.requrense == 'нет') {
      lvl = persLevel;
    }

    if (lvl >= 90) {
      if (mn5 == null || mn5 == undefined) {
        mn5 = 0;
      }
      if (mn5 > this.mn5Count) {
        mn5 = 0;
      }

      let path = this.getImgPath(mn5);
      mn5++;

      return path;
    }
    if (lvl >= 80) {
      if (!mn4 || mn4 == undefined) {
        mn4 = 0;
      }
      if (mn4 > this.mn4Count) {
        mn4 = 0;
      }

      let path = this.getImgPath(mn4);
      mn4++;

      return path;
    }
    if (lvl >= 60) {
      if (!mn3 || mn3 == undefined) {
        mn3 = 0;
      }
      if (mn3 > this.mn3Count) {
        mn3 = 0;
      }

      let path = this.getImgPath(mn3);
      mn3++;

      return path;
    }
    if (lvl >= 40) {
      if (!mn2 || mn2 == undefined) {
        mn2 = 0;
      }
      if (mn2 > this.mn2Count) {
        mn2 = 0;
      }

      let path = this.getImgPath(mn2);
      mn2++;

      return path;
    }
    if (lvl >= 20) {
      if (!mn1 || mn1 == undefined) {
        mn1 = 0;
      }
      if (mn1 > this.mn1Count) {
        mn1 = 0;
      }

      let path = this.getImgPath(mn1);
      mn1++;

      return path;
    }

    if (!mn0 || mn0 == undefined) {
      mn0 = 0;
    }
    if (mn0 > this.mn0Count) {
      mn0 = 0;
    }

    let path = this.getImgPath(mn0);
    mn0++;

    return path;
  }

  getImgPath(num: number): string {
    let result: string = 'assets/img/';

    let ss = '000' + num;
    ss = ss.substr(ss.length - 3);

    result+= '.jpg';

    return result;
  }
}
