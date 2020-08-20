import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeVal'
})
export class TimeValPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    switch (value) {
      case 1:
        return 'Утро';
      case 2:
        return 'День';
      case 3:
        return 'Вечер';
      case 4:
        return 'Перед сном';
      case 5:
        return 'Весь день';
    }
    return null;
  }

}
