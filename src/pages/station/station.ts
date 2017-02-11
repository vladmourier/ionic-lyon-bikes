import {NavController, NavParams} from "ionic-angular";
import {Component} from "@angular/core";
import {Station} from "../../model/station/Station";
import {Storage} from '@ionic/storage'
import {StationService} from "../../model/station/StationService";
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

  constructor(public navCtrl: NavController, private navParams: NavParams, public storage: Storage, public stationService: StationService) {
    this.station = new Station(navParams.data);
    this.stationService.isFavorite(this.station).then((isFav) => {
        if (isFav)
            this.favText = "Remove From Favorites";
        else
            this.favText = "Add To Favorites";
    });
  }

  switchFav(event) {
      console.log('switching fav');
      this.stationService.isFavorite(this.station).then((isFav) => {
          if (isFav) {
              this.stationService.removeFromFavorites(this.station);
                  this.favText = "Add To Favorites";
          }
          else {
              this.stationService.addToFavorites(this.station);
              this.favText = "Remove From Favorites";
          }
      });
  }

  ionViewWillLeave(){
    this.navCtrl.remove(1);
  }
}
