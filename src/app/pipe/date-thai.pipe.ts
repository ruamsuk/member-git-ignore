import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateThai'
})
export class DateThaiPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value)
    {
      return null;
    } else {
      const dt = new Date(value).getDay();
      const dd = new Date(value).getDate();
      const mm = new Date(value).getMonth();
      const yy = new Date(value).getFullYear();

      const thaiDay = ['อา.', ' จ.', ' อ.', ' พ.', 'พฤ.', ' ศ.', ' ส.'];
      const thaiMount = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      const thaiyear = yy + 543;
      return thaiDay[dt] + ' ' + dd + ' ' + thaiMount[mm] + ' ' + thaiyear;
    }
  }

}
