import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapDisplayCard'
})
export class MapDisplayCardPipe implements PipeTransform {

  transform(value: string): any {
    const res = value.replace(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/, '$1 $2 $3 $4');
    return res;
  }

}
