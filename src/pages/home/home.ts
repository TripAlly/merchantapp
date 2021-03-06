import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { NavController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { MerchantServiceProvider } from '../../providers/merchant-service/merchant-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ NativeStorage, MerchantServiceProvider ]
})
export class HomePage {
  merchant = {
    merchant_contract: ''
  };

  empty: Boolean = true;

  constructor(public navCtrl: NavController,
              private nativeStorage: NativeStorage,
              private clipboard: Clipboard,
              public merchantServiceProvider: MerchantServiceProvider) {
    this.getMerchant();
  }

  copyToClipboard() {
    this.clipboard.copy(this.merchant.merchant_contract);
  }

  ionViewWillEnter() {
    this.getMerchant();
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
