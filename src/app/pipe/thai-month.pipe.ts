import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thaiMonth'
})
export class ThaiMonthPipe implements PipeTransform {
  showThaiMonth!: string;

  transform(value: string | number | null | undefined ) {
    if (typeof value == 'number') {
      let thaiMonth = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ];
      this.showThaiMonth = thaiMonth[value];
    } else {
      return null;
    }
    return this.showThaiMonth;
  }

}
