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
  loading = 'Please wait untill I fill these columns for you..!';
  switchString = 'Switch to Favourites';
  switchBool = 0;
  tempBank = [];
  mumbaiBanks = [];
  delhiBanks = [];
  bangaloreBanks = [];
  puneBanks = [];
  favBanks = [];
  startPointer = 0;
  endPointer = 0;
  noOfRows = 10;

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
        this.loading = 'Your favourites are added here, try adding some.';
        this.switchBool = 1;
        this.switchString = 'Switch to Browse Mode';
        this.tempBank = [];
      } else {
      this.loading = '';
      this.switchBool = 1;
      this.switchString = 'Switch to Browse Mode';
      this.tempBank = this.favBanks;
      }
    } else {
      this.loading = '';
      this.switchBool = 0;
      this.switchString = 'Switch to Favourites';
      this.pagination(this.noOfRows) ;
    }
  }

  pagination(noOfRows: any) {
    let i;
    this.tempBank = [];
    this.noOfRows = noOfRows;
    if (Number(noOfRows) < this.bank.length) {
      for ( i = this.startPointer; i < Number(this.startPointer) + Number(noOfRows); i++) {
        this.tempBank.push(this.bank[i]);
        console.log(i);
      }
    } else {
      this.tempBank = this.bank;
    }
    this.endPointer = i;
  }

  nextPage() {
    this.tempBank = [];
    if ((Number(this.endPointer) + Number(this.noOfRows)) <= Number(this.bank.length)) {
      console.log('I should be here');
      this.startPointer = this.endPointer;
    } else {
      console.log('I should not be here');
      this.noOfRows = ((this.endPointer + this.noOfRows) - this.bank.length);
    }
    this.pagination(this.noOfRows);
  }

  prevPage() {
    this.tempBank = [];
    if ((Number(this.startPointer) - Number(this.noOfRows)) >= 0) {
      this.startPointer -= this.noOfRows;
    } else {
      this.startPointer = 0;
    }
    this.pagination(this.noOfRows);
  }

  filterCity(filval: any) {
    switch (filval) {
       case '0' : this.bank = this.mumbaiBanks; this.pagination(this.noOfRows); break;
       case '1' : this.bank = this.delhiBanks; this.pagination(this.noOfRows); break;
       case '2' : this.bank = this.puneBanks; this.pagination(this.noOfRows); break;
       case '3' : this.bank = this.bangaloreBanks; this.pagination(this.noOfRows); break;
    }
  }

  constructor(private http: HttpClient) {
    this.http.get('https://vast-shore-74260.herokuapp.com/banks?city=MUMBAI').
    subscribe((response: any[]) => {
      this.bank = response; this.mumbaiBanks = this.bank; this.loading = ''; this.pagination(this.noOfRows); });
    this.http.get('https://vast-shore-74260.herokuapp.com/banks?city=DELHI').
    subscribe((response: any[]) => { this.delhiBanks = response; });
    this.http.get('https://vast-shore-74260.herokuapp.com/banks?city=BANGALORE').
    subscribe((response: any[]) => { this.bangaloreBanks = response; });
    this.http.get('https://vast-shore-74260.herokuapp.com/banks?city=PUNE').
    subscribe((response: any[]) => { this.puneBanks = response; });
  }
}
