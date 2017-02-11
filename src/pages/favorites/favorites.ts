import {Component} from '@angular/core';
import {NavController} from "ionic-angular";
import {HomePage} from "../home/home";
import {Station} from "../../model/station/Station";
import {Storage} from '@ionic/storage'
import {StationService} from "../../model/station/StationService";

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
  providers: [],
})
export class FavoritesPage {
  searchedValue: string;
  cursor: number = 20;
  favorites: Station[];

  constructor(public navController: NavController, public storage: Storage, public stationService: StationService) {
  }

  ngOnInit() {
      //this.getFavorites();
  }

  ionViewWillEnter() {
      this.getFavorites();
  }

  getFavorites() {
      var stations = StationService._stations;
      this.favorites = [];
      var self = this;
          for (let sta in stations)
            this.stationService.isFavorite(stations[sta]).then((res) => {
                    if (res)
                        self.favorites.push(stations[sta]);
                });

  }

  jumpToStation(event) {
    let clickedStationName = event.target.innerText.trim();
    let regex = new RegExp(clickedStationName, 'i');
    HomePage.stationToGo = this.favorites
      .find((station) => regex.test(station.name));
    this.navController.parent.select(0);
  }

  doInfinite(infiniteScroll) {
    //this.getFavorites();
    var self = this;
    let favoritesList = document.getElementById("favoritesList");
    let oldCursor = this.cursor;
    this.cursor += 20;
    for (let i = oldCursor; i < this.cursor; i++) {
    //for (let i = 0; i < 2; i++) {
      let station = this.favorites[i];
      let stationHTML = document.createElement('ion-item');
      stationHTML.className = "item-block item item-md my-dir";
      stationHTML.addEventListener('click', (event: any) => {
        let clickedStationName = event.target.innerText.trim();
        let regex = new RegExp(clickedStationName, 'i');
        HomePage.stationToGo = self.favorites
          .find((station) => regex.test(station.name));
        self.navController.parent.select(0);
      });
      stationHTML.setAttribute("tappable", 'true');
      stationHTML.innerHTML = '<ion-thumbnail item-left><img src="https://biok03.github.io/bi-velov/images/stations/' + station.number + '.jpg"></ion-thumbnail>' +
        '<div class="item-inner"><div class="input-wrapper"><ion-label class="label label-md">'
        + station.name + '</ion-label></div></div>';


      favoritesList.appendChild(stationHTML)
    }
    infiniteScroll.complete();
  }
}
