import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { StationComponent } from './station.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import {StationPage} from "../pages/station/station";

@NgModule({
  declarations: [
    StationComponent,
    AboutPage,
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
    ContactPage,
    HomePage,
    StationPage,
    TabsPage
  ],
  providers: []
})
export class AppModule {}
