import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { StationComponent } from './station.component';
import { AboutPage } from '../pages/about/about';
import { SearchPage } from '../pages/search/search';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import {StationPage} from "../pages/station/station";
import {StationService} from "../model/StationService";

@NgModule({
  declarations: [
    StationComponent,
    AboutPage,
    SearchPage,
    ContactPage,
    HomePage,
    StationPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(StationComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    StationComponent,
    AboutPage,
    SearchPage,
    ContactPage,
    HomePage,
    StationPage,
    TabsPage
  ],
  providers: [
    StationService
  ]
})
export class AppModule {}
