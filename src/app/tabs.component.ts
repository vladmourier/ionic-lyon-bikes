import {Component, ViewChild} from '@angular/core';
import {Platform, NavController} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {Storage} from '@ionic/storage'
import {TabsPage} from '../pages/tabs/tabs';

declare var ol: any;

@Component({
  template: `<ion-nav #myNav [root]="rootPage"></ion-nav>`,
  providers: [Storage]
})
export class TabsComponent {
  rootPage = TabsPage;
  @ViewChild('myNav') nav: NavController;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

}
