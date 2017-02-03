import {NavController} from "ionic-angular";
import {Station} from "../model/station/Station";
import {StationService} from "../model/station/StationService";
/**
 * Created by Vlad on 29/01/2017.
 */
export class StationWorker {
  _stations: Station[];
   stations: Station[];

  constructor(public navCtrl: NavController) {
  }

  initStations() {
    this._stations = StationService.stations;
    this.stations = [];
    for (let sta in this._stations) {
      this.stations.push(this._stations[sta]);
    }
    this._stations = [];
  }
}
