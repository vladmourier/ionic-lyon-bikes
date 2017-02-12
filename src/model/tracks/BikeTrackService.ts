import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Storage} from '@ionic/storage'
import {Observable} from "rxjs";
import {parseError} from "../station/StationService"
/**
 * Created by Vlad on 22/01/2017.
 */
@Injectable()
export class BikeTrackService {
  public static bikeTracks: any;
  private readonly TracksURL = "https://download.data.grandlyon.com/wfs/grandlyon?SERVICE=WFS&VERSION=2.0.0&outputformat=GEOJSON&request=GetFeature&typename=pvo_patrimoine_voirie.pvoamenagementcyclable&SRSNAME=urn:ogc:def:crs:EPSG::4326";
  private parseError = parseError;

  constructor(private http: Http, public storage: Storage) {
  }

  requestTracks(refresh : boolean = false): Observable<any> {
    if(!refresh && typeof BikeTrackService.bikeTracks !== "undefined"){
      return Observable.of(BikeTrackService.bikeTracks);
    } else return this.http.get(this.TracksURL)
      .map(res => this.extractData(res, this))
      .catch(error => this.requestFromLocalStorage(error, this));
  }

  private extractData(res: Response, self) {
    console.log("EXTRACT DATA");
    let body = res.json();
    self.storage.set('biketracks', body);
    return body;
  }

  private requestFromLocalStorage(error: Response | any, self) {
    console.log("EXTRACT LOCALSTORAGE DATA");
    self.storage.get('biketracks')
      .then(res => Observable.of(res))
      .catch(Othererror => {
        let errMsg = self.parseError([error, Othererror]);
        return Observable.throw(errMsg);
      });
    return Observable.throw(self.parseError([error]));
  }
}
