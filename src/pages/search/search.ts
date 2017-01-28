import {Component} from '@angular/core';
import {Station} from "../../model/station/Station";
import {StationService} from "../../model/station/StationService";
import {NavController} from "ionic-angular";
import {StationComponent} from "../../app/station.component";

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: []
})
export class SearchPage {
  _stations: Station[];
  stations: Station[];
  searchedValue: string;

  constructor(public navController: NavController) {
  }

  ngOnInit() {
    this.initStations();
  }

  initStations() {
    this._stations = StationService.stations;
    this.stations = [];
    for (let sta in this._stations) {
      this.stations.push(this._stations[sta]);
    }
    this._stations = [];
  }

  getItems(event) {
    this.searchedValue = event.target.value;
    this.initStations();
    if (this.searchedValue && this.searchedValue.trim() != '') {
      let regex = new RegExp(this.searchedValue, 'i');
      this.stations = this.stations.filter((station) => {
        return regex.test(station.name) || regex.test(station.commune)
      });
    }
  }

  jumpToStation(event) {
    let clickedStationName = event.target.childNodes[1].innerHTML.trim();
    let regex = new RegExp(clickedStationName, 'i');
    StationComponent.stationToGo = this.stations.find((station) => {
      return regex.test(station.name)
    });
    this.navController.parent.select(0);
    console.log(this.navController.parent.getSelected())
  }
}
