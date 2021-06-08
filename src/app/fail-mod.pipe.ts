import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'failMod'
})
export class FailModPipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    if (value && value > 0) {
      let mod=Math.pow(2, value);
      if (mod<100) {
        return 'x'+mod;
      }
      else{
        return ''+mod;
      }
     
    }
    else {
      return null;
    }
  }

}
