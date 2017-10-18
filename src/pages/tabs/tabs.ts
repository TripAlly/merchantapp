import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { PaymentsPage } from '../payments/payments';
import { BalancePage } from '../balance/balance';
import { SettingsPage } from '../settings/settings';

import { GlobalProvider } from '../../providers/global/global';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  homePageRoot = HomePage;
  paymentsPageRoot = PaymentsPage;
  balancePageRoot = BalancePage;
  settingsPageRoot = SettingsPage;

  constructor(public globalProvider: GlobalProvider) {

  }

  onChange() {
    console.log(this.globalProvider)
  }
}
