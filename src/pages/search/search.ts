import {Component} from '@angular/core';
import {NavController} from "ionic-angular";
import {StationWorker} from "../../app/StationWorker";
import {HomePage} from "../home/home";
import {Station} from "../../model/station/Station";


@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [],
})
export class SearchPage extends StationWorker {
  searchedValue: string;
  cursor: number = 20;
  displayedStations: Station[] = [];

  constructor(public navController: NavController) {
    super(navController);
  }

  ngOnInit() {
    this.initStations();
    for (let i = 0; i < this.cursor; i++)
      this.displayedStations.push(this.stations[i]);
  }

  getItems(event) {
    this.searchedValue = event.target.value;
    this.initStations();
    this.cursor = 20;
    if (this.searchedValue && this.searchedValue.trim() != '') {
      let regex = new RegExp(this.searchedValue, 'i');
      this.displayedStations = this.stations.filter((station) => regex.test(station.name) || regex.test(station.commune));
    }
  }

  jumpToStation(event) {
    let clickedStationName = event.target.innerText.trim();
    let regex = new RegExp(clickedStationName, 'i');
    HomePage.stationToGo = this.stations
      .find((station) => regex.test(station.name));
    this.navController.parent.select(0);
  }

  doInfinite(infiniteScroll) {
    var self = this;
    let stationList = document.getElementById("stationsList");
    let oldCursor = this.cursor;
    this.cursor += 20;
    for (let i = oldCursor; i < this.cursor; i++) {
      let station = this.stations[i];
      let stationHTML = document.createElement('ion-item');
      stationHTML.className = "item-block item item-md my-dir";
      stationHTML.addEventListener('click', (event: any) => {
        let clickedStationName = event.target.innerText.trim();
        let regex = new RegExp(clickedStationName, 'i');
        HomePage.stationToGo = self.stations
          .find((station) => regex.test(station.name));
        self.navController.parent.select(0);
      });
      stationHTML.setAttribute("tappable", 'true');
      stationHTML.innerHTML = '<ion-thumbnail item-left><img class="list-img" src="assets/stations/' + station.number + '.jpg"></ion-thumbnail>' +
        '<div class="item-inner"><div class="input-wrapper"><ion-label class="label label-md">'
        + station.name + '</ion-label></div></div>';


      stationList.appendChild(stationHTML)
    }
    infiniteScroll.complete();
  }
}
