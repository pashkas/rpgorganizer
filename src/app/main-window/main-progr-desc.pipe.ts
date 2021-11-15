import { Pipe, PipeTransform } from '@angular/core';
import { Pers } from 'src/Models/Pers';

@Pipe({
  name: 'mainProgrDesc'
})
export class MainProgrDescPipe implements PipeTransform {

  transform(pers: Pers, ...args: any[]): any {
    if (pers) {
      let ret = '';

      ret += pers.name
            + '';

      return ret;
    }

    return null;
  }

}
