/**
 * Created by Vlad on 25/11/2016.
 */
import {Injectable}     from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';
import {Station} from "./Station";

@Injectable()
export class StationService {
  private static _stations: Station[];
  private stationsUrl = 'https://download.data.grandlyon.com/ws/rdata/jcd_jcdecaux.jcdvelov/all.json';  // URL to web API
  constructor(private http: Http) {
  }

  requestStations(): Observable<any> {
    return this.http.get(this.stationsUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  static get stations(): Station[] {
    return this._stations;
  }

  static set stations(value: Station[]) {
    this._stations = value;
  }

  private extractData(res: Response) {
    return res.json();
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
}
