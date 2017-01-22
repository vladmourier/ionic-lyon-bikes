import {Component, ViewChild} from '@angular/core';

import { NavController } from 'ionic-angular';
import {StationComponent} from "../../app/station.component";
import {StationPage} from "../station/station";
declare var ol: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') map;
  constructor(public navCtrl: NavController) {
  }

  ionViewWillEnter(){
    if(typeof StationComponent.stationToGo !== "undefined"){
      this.navCtrl.push(StationPage, StationComponent.stationToGo);
      delete StationComponent.stationToGo;
    }
  }
}
