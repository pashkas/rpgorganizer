import { Pipe, PipeTransform } from '@angular/core';
import { Pers } from 'src/Models/Pers';

@Pipe({
  name: 'rarecol'
})
export class RarecolPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    switch (value) {
      case Pers.commonRevSet.name:
        return 'gray';
      case Pers.uncommonRevSet.name:
        return 'green';
      case Pers.rareRevSet.name:
        return 'blue';
      case Pers.epicRevSet.name:
        return 'purple';
      case Pers.legendaryRevSet.name:
        return 'orange';
      default:
        return 'gray';
    }

  }

}
