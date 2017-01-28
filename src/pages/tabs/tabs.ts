import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { AnalyticsPage } from '../analytics/analytics';
import {SearchPage} from "../search/search";
import {StationService} from "../../model/station/StationService";

@Component({
  templateUrl: 'tabs.html',
  providers: [StationService]
})
export class TabsPage {
  // this tells the station component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = AboutPage;
  tab3Root: any = SearchPage;
  tab4Root: any = AnalyticsPage;

  constructor(public stationService: StationService) {
  }
}
