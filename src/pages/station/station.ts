import {NavController, NavParams} from "ionic-angular";
import {Component} from "@angular/core";
import {Station} from "../../model/Station";
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
    console.log("building details page");
    console.log(navParams.get("number"));

    this.station = new Station(navParams.data);

    console.log(this.station);
  }
}
