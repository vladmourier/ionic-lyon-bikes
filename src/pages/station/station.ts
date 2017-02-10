import {NavController, NavParams} from "ionic-angular";
import {Component} from "@angular/core";
import {Station} from "../../model/station/Station";
/**
 * Created by Vlad on 09/12/2016.
 */

@Component({
  selector: 'page-detail',
  templateUrl: 'station.html'
})
export class StationPage {
  public station;

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.station = new Station(navParams.data);
  }

  ionViewWillLeave(){
    this.navCtrl.remove(1);
  }
}
