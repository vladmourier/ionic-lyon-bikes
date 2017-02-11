import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
/**
 * Created by Vlad on 22/01/2017.
 */
@Injectable()
export class BikeTrackService {
  private readonly TracksURL = "https://download.data.grandlyon.com/wfs/grandlyon?SERVICE=WFS&VERSION=2.0.0&outputformat=GEOJSON&request=GetFeature&typename=pvo_patrimoine_voirie.pvoamenagementcyclable&SRSNAME=urn:ogc:def:crs:EPSG::4326";

  constructor(private http: Http) {
  }

  requestTracks(): Observable<any> {
    return this.http.get(this.TracksURL)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body;
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
