/**
 * Created by Vlad on 25/11/2016.
 */
import {Injectable}     from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';
import {Station} from "./Station";
import {Storage} from '@ionic/storage'

@Injectable()
export class StationService {
  public static _stations: Station[];
  private stationsUrl = 'https://download.data.grandlyon.com/ws/rdata/jcd_jcdecaux.jcdvelov/all.json';  // URL to web API
  constructor(private http: Http, private storage: Storage) {
  }

  requestStations(refresh: boolean = false): Observable<any> {
    if (!refresh && typeof StationService._stations !== "undefined") {
      return Observable.of(StationService._stations).map(value => value).catch(error => {
        console.log(error);
        return [];
      });
    } else return this.http.get(this.stationsUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let stations = [];
    let stationsArray = res.json().values;
    for (let i = 0, l = stationsArray.length; i < l; i++) {
      let station = new Station(stationsArray[i]);
      stations[station.number] = station;
    }
    StationService._stations = stations;
    return stations;
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }



  isFavorite(a_station):Promise<any> {
      return new Promise((resolve, reject) => {
        this.storage.get('favorites').then((favs) => {
          for (let favname in favs)
            if (a_station.name == favs[favname]) {

                    console.log('testing favoriteness');

                      resolve(true);
            }
          resolve(false);
        });
      })
  }

  addToFavorites(a_station) {
    this.storage.get('favorites').then((favs) => {
      for (let favname in favs)
        if (a_station.name == favs[favname])
          return;
      favs.push(a_station.name);
      this.storage.set('favorites', favs);
    });
  }

  removeFromFavorites(a_station) {
      this.storage.get('favorites').then((favs) => {
        this.storage.set('favorites', favs.filter((fav) => {
            return fav != a_station.name;
        }));
      });
  }
}
