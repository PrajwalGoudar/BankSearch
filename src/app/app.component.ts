import { Component, NgModule, VERSION } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Bank data
  bank = [];
  favMessage: boolean = false;
  loading: boolean = true;
  switchString = 'Switch to Favourites';
  searchText: String = '';
  switchBool:boolean = false;
  tempBank = [];
  apiRoot = 'https://vast-shore-74260.herokuapp.com/banks?city=';
  cityName = '';
  pageNumber: number = 1;
  searchBool: boolean = false;
  boolPage: boolean = false;
  favBanks = [];
  startPointer = 0;
  endPointer = 0;
  noOfRows = 10;
  buttonList = [1,2,3,4,5];

  getFav(favBank: any) {
    for ( let i = 0; i < this.favBanks.length; i++) {
      if ( favBank === this.favBanks[i].ifsc) {
        this.favBanks.splice(i, 1);
        return;
      }
    }
    for ( let b of this.tempBank ) {
      if (b.ifsc === favBank) {
        this.favBanks.push(b);
        return;
      }
    }
  }

  onClickSwitch() {
    if (!this.switchBool) {
      if (!this.favBanks.length) {
        this.favMessage = true;
        this.switchBool = true;
        this.switchString = 'Switch to Browse Mode';
        this.tempBank = [];
      } else {
      this.favMessage = false;
      this.switchBool = true;
      this.switchString = 'Switch to Browse Mode';
      this.tempBank = this.favBanks;
      }
    } else {
      this.favMessage = false;
      this.switchBool = false;
      this.switchString = 'Switch to Favourites';
      this.pagination(this.noOfRows) ;
    }
  }

  pagination(noOfRows: any) {
    let i;
    this.tempBank = [];
    this.noOfRows = noOfRows;
    if(this.boolPage){
      this.startPointer = Number(this.noOfRows) * (this.pageNumber-1);
      this.boolPage = false;
    }
    if (Number(noOfRows) < this.bank.length) {
      for ( i = this.startPointer; i < Number(this.startPointer) + Number(noOfRows); i++) {
        this.tempBank.push(this.bank[i]);
      }
    } else {
      this.tempBank = this.bank;
    }
    this.endPointer = i;
  }

  randomFunc(){
    if(this.searchText.length > 0){
      this.searchBool = true;
    } else {
      this.searchBool = false;
    }
  }
  


  
  changeButtonNumber(value: number) {
    if(value<1){
      value = 1;
    } 
    if(value >= this.bank.length){
      value = this.bank.length;
    }
    for(let i=0; i<5; i++){
      this.buttonList[i] = value + i; 
    }   
  }

  onClickPageNumber(pageNumber: any){
    this.pageNumber = Number(pageNumber);
    this.changeButtonNumber(this.pageNumber);
    this.boolPage = true;
    this.pagination(this.noOfRows);
  }

  nextPage() {
    this.changeButtonNumber(this.buttonList[0]+1);
    this.tempBank = [];
    if ((Number(this.endPointer) + Number(this.noOfRows)) <= Number(this.bank.length)) {
      this.startPointer = this.endPointer;
    } else {
      this.noOfRows = ((this.endPointer + this.noOfRows) - this.bank.length);
    }
    this.pagination(this.noOfRows);
  }

  prevPage() {
    this.changeButtonNumber(this.buttonList[0]-1);
    this.tempBank = [];
    if ((Number(this.startPointer) - Number(this.noOfRows)) >= 0) {
      this.startPointer -= this.noOfRows;
    } else {
      this.startPointer = 0;
    }
    this.pagination(this.noOfRows);
  }

  filterCity(filval: any) {
    this.cityName = String(filval);
    this.tempBank = [];
    this.loading = true;
    switch (filval) {
       case 'MUMBAI' : this.fetchData('MUMBAI'); 
                      break;
       case 'DELHI' : this.fetchData('DELHI'); 
                      break;
       case 'PUNE' : this.fetchData('PUNE');
                     break;
       case 'BANGALORE' : this.fetchData('BANGALORE');
                          break;
    }
  }

  fetchData(cityName: any){
    let promise = new Promise((resolve, reject) => {
      let apiURL = `${this.apiRoot}${cityName}`;
      this.http.get(apiURL)
        .toPromise()
        .then(
         (res: any )=> {
            this.bank = res; this.loading = false; this.pagination(this.noOfRows);
          }
        );
    });
  }

  constructor(private http: HttpClient) {
    this.filterCity('MUMBAI');
  }
}
