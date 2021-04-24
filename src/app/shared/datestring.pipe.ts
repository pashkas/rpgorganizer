import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'datestring'
})
export class DatestringPipe implements PipeTransform {

  transform(dt: any, ...args: any[]): any {
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

    return date.toLocaleDateString([], { day: 'numeric', month: 'numeric' });
  }

}
