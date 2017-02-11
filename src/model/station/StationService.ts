/**
 * Created by Vlad on 25/11/2016.
 */
import {Injectable}     from '@angular/core';
import {Storage} from '@ionic/storage'
import {Http, Response} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';
import {Station} from "./Station";

@Injectable()
export class StationService {
  public static _stations: Station[];
  private stationsUrl = 'https://download.data.grandlyon.com/ws/rdata/jcd_jcdecaux.jcdvelov/all.json';  // URL to web API
  constructor(private http: Http, public storage: Storage) {
  }

  requestStations(refresh: boolean = false): Observable<any> {
    if (!refresh && typeof StationService._stations !== "undefined") {
      return Observable.of(StationService._stations);
    } else return this.http.get(this.stationsUrl)
      .map(res => this.extractData(res, this))
      .catch(error => this.requestFromLocalStorage(error, this));
  }

  private extractData(res: Response, self) {
    let stations = [];
    let stationsArray = res.json().values;
    for (let i = 0, l = stationsArray.length; i < l; i++) {
      let station = new Station(stationsArray[i]);
      stations[station.number] = station;
    }
    StationService._stations = stations;
    self.storage.set('stations', stations);
    return stations;
  }

  private requestFromLocalStorage(error: Response | any, self) {
    //Tries to get the stations from LocalStorage
    self.storage.get('stations')
      .then(res => Observable.of(res))
      .catch(Othererror => {
        let errMsg = self.parseError([error, Othererror]);
        return Observable.throw(errMsg);
      });
    return Observable.throw(this.parseError([error]));
  }

  private parseError(errors: any[]) {
    let errMsg: string;
    errors.forEach((error) => {
      if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      } else {
        errMsg = error.message ? error.message : error.toString();
      }
      errMsg += "\r\n";
    });
    return errMsg
  }
}
