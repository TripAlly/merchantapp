import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the MerchantServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MerchantServiceProvider {
  public data: any = null;
  public selected: any = null;

  constructor(public http: Http) {
    console.log('Hello MerchantServiceProvider Provider');
  }

  load() {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.http.get('https://tripally.co/merchant.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;

          resolve(this.data);
        });
    });
  }

}
