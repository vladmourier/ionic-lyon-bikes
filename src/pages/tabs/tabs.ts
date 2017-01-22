import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import {SearchPage} from "../search/search";
import {StationService} from "../../model/station/StationService";
import {StationComponent} from "../../app/station.component";

@Component({
  templateUrl: 'tabs.html',
  providers: [StationService]
})
export class TabsPage {
  // this tells the station component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = AboutPage;
  tab3Root: any = ContactPage;
  tab4Root: any = SearchPage;

  constructor(public stationService: StationService) {
  }
}
