import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { TabsComponent } from './tabs.component';
import { FavoritesPage } from '../pages/favorites/favorites';
import { SearchPage } from '../pages/search/search';
import { AnalyticsPage } from '../pages/analytics/analytics';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import {StationPage} from "../pages/station/station";
import {StationService} from "../model/station/StationService";
import {BikeTrackService} from "../model/tracks/BikeTrackService";

@NgModule({
  declarations: [
    TabsComponent,
    FavoritesPage,
    SearchPage,
    AnalyticsPage,
    HomePage,
    StationPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(TabsComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    TabsComponent,
    FavoritesPage,
    SearchPage,
    AnalyticsPage,
    HomePage,
    StationPage,
    TabsPage
  ],
  providers: [
    StationService,
    BikeTrackService
  ]
})
export class AppModule {}
