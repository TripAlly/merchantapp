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
  }

  ionViewWillEnter() {
    this.getMerchant()
    this.updateBalance();
  }

  updateBalance() {
    this.http.get('https://tripally.co/api/?address=' + this.merchant.merchant_contract)
      .map(res => res.json())
      .subscribe(data => {
        this.balance = data;
      });
  }

  getMerchant() {
    this.nativeStorage.getItem('merchant')
      .then((data) =>{
          this.merchant = data;
          this.empty = false;
        }, (error) => {
          console.error(error);
          this.empty = true;
        }
      );
  }

}
