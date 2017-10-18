import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MerchantServiceProvider } from '../../providers/merchant-service/merchant-service';

import { GlobalProvider } from '../../providers/global/global';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [ MerchantServiceProvider, NativeStorage, InAppBrowser ]
})
export class SettingsPage {
  merchantId: string = '';
  merchantData: any = [];
  merchantSelected: any = {
    merchant_contract: ''
  };

  constructor(public navCtrl: NavController,
              public globalProvider: GlobalProvider,
              public merchantServiceProvider: MerchantServiceProvider,
              private nativeStorage: NativeStorage,
              private iab: InAppBrowser) {

    this.loadMerchant();
  }

  loadMerchant() {
    this.merchantServiceProvider.load()
      .then(data => {
        this.merchantData = data;

        this.getMerchant();
      });
  }

  openEtherscan() {
    this.iab.create('https://etherscan.io/address/' + this.merchantSelected.merchant_contract);
  }

  upgradeApp() {
    this.iab.create('https://tripally.co/tripally-merchant.apk');
  }

  ionViewWillEnter() {
    console.log(this.globalProvider)
  }

  getMerchant() {
    this.nativeStorage.getItem('merchant')
      .then((data) =>{
          this.merchantServiceProvider.selected = this.merchantSelected = data;
          this.globalProvider.enabledHome = true;
          this.merchantId = data.merchant_id;
          console.log(data)
        }, (error) => {
          console.error(error);
        }
      );
  }

  removeMerchant() {
    this.nativeStorage.remove('merchant')
      .then((data) =>{
          console.log(data)
        }, (error) => {
          console.error(error);
        }
      );
  }

  onKeyUp() {
    let filtered: Array<Object>;

    if (!this.merchantId.length) {
      this.removeMerchant();

      this.merchantSelected = {
        merchant_contract: ''
      };
    }

    filtered = this.merchantData.filter(v => {
      return (this.merchantId.toUpperCase() === v.merchant_id)
    });

    this.merchantServiceProvider.selected = this.merchantSelected = filtered[0] ? filtered[0] : {};

    if (filtered[0]) {
      this.globalProvider.enabledHome = true;
      this.nativeStorage.setItem('merchant', filtered[0])
        .then(() => console.log('Stored item!'),
              error => console.error('Error storing item', error)
        );
    } else {
      this.removeMerchant();
    }


    console.log(this.merchantSelected);
  }

}
