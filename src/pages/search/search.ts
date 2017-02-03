import {Component} from '@angular/core';
import {NavController} from "ionic-angular";
import {StationComponent} from "../../app/station.component";
import {StationWorker} from "../../app/StationWorker";

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: []
})
export class SearchPage extends StationWorker{
  searchedValue: string;

  constructor(public navController: NavController) {
    super(navController);
  }

  ngOnInit() {
    this.initStations();
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
