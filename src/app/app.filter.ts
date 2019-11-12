import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;
    searchText = searchText.toLowerCase();
        return items.filter( it => {
          if(it.bank_id.toString().includes(searchText) || it.bank_name.toLowerCase().includes(searchText) || it.ifsc.toLowerCase().includes(searchText) || it.branch.toLowerCase().includes(searchText)) return true;
          return false;
        });
   }
}
