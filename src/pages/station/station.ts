import {NavController, NavParams} from "ionic-angular";
import {Component} from "@angular/core";
import {Station} from "../../model/station/Station";
import {Storage} from '@ionic/storage'
/**
 * Created by Vlad on 09/12/2016.
 */

@Component({
  selector: 'page-detail',
  templateUrl: 'station.html'
})
export class StationPage {
  public station;
  public favText = "Default";

  constructor(public navCtrl: NavController, private navParams: NavParams, public storage: Storage) {
    this.station = new Station(navParams.data, storage);
    this.station.isFavorite().then((isFav) => {
        if (isFav)
            this.favText = "Remove From Favorites";
        else
            this.favText = "Add To Favorites";
    });
  }

  switchFav(event) {
      console.log('switching fav');
      this.station.isFavorite().then((isFav) => {
          if (isFav) {
              this.station.removeFromFavorites();
                  this.favText = "Add To Favorites";
          }
          else {
              this.station.addToFavorites();
              this.favText = "Remove From Favorites";
          }
      });
  }
}
