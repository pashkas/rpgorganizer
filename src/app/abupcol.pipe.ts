import { Pipe, PipeTransform } from '@angular/core';
import { Ability } from 'src/Models/Ability';

@Pipe({
  name: 'abupcol'
})
export class AbupcolPipe implements PipeTransform {

  transform(value: Ability, ...args: any[]): any {
    if (value.tasks.length > 0) {
      let tsk = value.tasks[0];
      const val = tsk.value;
      if (tsk.statesDescr[val] == tsk.statesDescr[val+1] && val >= 1) {
        return 'text-warning border border-warning';
      }
    }

    return 'text-success';
  }

}
