import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { MerchantServiceProvider } from '../../providers/merchant-service/merchant-service';
import { GlobalProvider } from '../../providers/global/global';
import { FileOpener } from '@ionic-native/file-opener';
import { AppVersion } from '@ionic-native/app-version';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [ MerchantServiceProvider,
               NativeStorage,
               InAppBrowser,
               FileTransfer,
               File,
               FileOpener,
               AppVersion
              ]
})
export class SettingsPage {
  merchantId: string = '';
  merchantData: any = [];
  merchantSelected: any = { merchant_contract: '' };

  updating = false;

  fileTransfer: FileTransferObject = this.transfer.create();

  constructor(public navCtrl: NavController,
              public globalProvider: GlobalProvider,
              public merchantServiceProvider: MerchantServiceProvider,
              private nativeStorage: NativeStorage,
              private iab: InAppBrowser,
              private transfer: FileTransfer,
              private file: File,
              public alertCtrl: AlertController,
              public http: Http,
              private fileOpener: FileOpener,
              private appVersion: AppVersion
            ) {

    this.loadMerchant();
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Updates available',
      message: 'Do you agree to download and install newest TripAlly Merchant application?',
      buttons: [
        {
          text: 'No, later',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes, install',
          handler: () => {
            this.downloadApp();
          }
        }
      ]
    });
    confirm.present();
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'No updates',
      subTitle: 'There are no updates currently available',
      buttons: ['OK']
    });
    alert.present();
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

  checkForUpdates() {
    this.http.get('https://tripally.co/tripally-merchant.json')
      .map(res => res.json())
      .subscribe(data => {
        this.appVersion.getVersionNumber().then((s) => {
          if (data.version.toString() > s.toString()) {
            this.showConfirm();
          } else {
            this.showAlert();
          }
        });
      });
  }

  upgradeApp() {
    this.downloadApp();
  }

  downloadApp() {
    const url = 'https://tripally.co/tripally-merchant.apk';

    this.updating = true;
    this.fileTransfer.download(url, this.file.externalDataDirectory + 'tripally-merchant.apk')
      .then((entry) => {
        this.updating = false;
        this.installApp(entry);
      }, (error) => {
        console.error(error);
      });
  }

  installApp(entry) {
    this.fileOpener.open(
      entry.toURL(),
      'application/vnd.android.package-archive'
    );
  }

  getMerchant() {
    this.nativeStorage.getItem('merchant')
      .then((data) =>{
          this.merchantServiceProvider.selected = this.merchantSelected = data;
          this.globalProvider.enabledHome = true;
          this.merchantId = data.merchant_id;
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
      return (this.merchantId.toUpperCase() === v.merchant_id.toUpperCase())
    });

    this.merchantServiceProvider.selected = this.merchantSelected = filtered[0] ? filtered[0] : {};

    if (filtered[0]) {
      this.nativeStorage.setItem('merchant', filtered[0])
        .then(() => console.log('Stored item!'),
              error => console.error('Error storing item', error));
    } else {
      this.removeMerchant();
    }
  }

}
