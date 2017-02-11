import {NavController, ToastController} from "ionic-angular";
import {Station} from "../model/station/Station";
import {StationService} from "../model/station/StationService";
/**
 * Created by Vlad on 29/01/2017.
 */
export class StationWorker {
  _stations: Station[];
  stations: Station[];

  constructor(public navCtrl: NavController, public stationService: StationService, public toastCtrl: ToastController) {
  }

  initStations() {
    this.stationService.requestStations().subscribe(
      stations => this._stations = stations,
      error => this.toastCtrl.create({
        message: "Impossible de récupérer les stations",
        duration: 3000
      }).present());
    this.stations = [];
    for (let sta in this._stations) {
      this.stations.push(this._stations[sta]);
    }
    this._stations = [];
  }
}
