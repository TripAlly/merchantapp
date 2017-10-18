import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { Clipboard } from '@ionic-native/clipboard';

import { HomePage } from '../pages/home/home';
import { PaymentsPage } from '../pages/payments/payments';
import { BalancePage } from '../pages/balance/balance';
import { SettingsPage } from '../pages/settings/settings';


import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MerchantServiceProvider } from '../providers/merchant-service/merchant-service';
import { GlobalProvider } from '../providers/global/global';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PaymentsPage,
    BalancePage,
    SettingsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PaymentsPage,
    BalancePage,
    SettingsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Clipboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MerchantServiceProvider,
    GlobalProvider
  ]
})
export class AppModule {}
