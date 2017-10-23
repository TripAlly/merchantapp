import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-balance',
  templateUrl: 'balance.html',
  providers: [ NativeStorage ]
})
export class BalancePage {
  public balance:any = null;

  merchant = {
    merchant_contract: ''
  };

  empty: Boolean = true;

  constructor(public navCtrl: NavController, public http: Http, private nativeStorage: NativeStorage) {
    this.http.get('http://tripally.co:8080/?address=0x9a49b818C95ea8a496F0FBdb444D55aAF100Be76')
      .map(res => res.json())
      .subscribe(data => {
        this.balance = data;
        console.log(this.balance);
      });
  }

  getMerchant() {
    this.nativeStorage.getItem('merchant')
      .then((data) =>{
          this.merchant = data;
          this.empty = false;

          console.log(data)
        }, (error) => {
          console.error(error);
          this.empty = true;
        }
      );
  }

}
