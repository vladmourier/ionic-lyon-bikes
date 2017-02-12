import {HomePage} from "../../pages/home/home";
/**
 * Created by Vlad on 25/11/2016.
 */

 declare var ol: any;

export class UserLocation {
  lat: number;
  lng: number;

  constructor(object: any){
    if(object) {
      if(object.latitude) this.lat = object.latitude;
      if(object.longitude) this.lng = object.longitude;
    }
  }

  static getStations(){

  }

  setLocation(object: any){
    if(object) {
      if(object.latitude) this.lat = object.latitude;
      if(object.longitude) this.lng = object.longitude;
    }
    else {
        this.lat = 0;
        this.lng = 0;
    }
  }

  getLocation() {
    let temp;
    if(typeof this.lng !== "undefined" || typeof this.lat !== "undefined")
       temp = ol.proj.transform([this.lng, this.lat], 'EPSG:4326', 'EPSG:3857');
    else temp = HomePage.INITIAL_COORDINATES;
      //console.log(temp)
      return temp;
  }

  public distanceTo(object: any){
      if(object) {
          var lat1 = this.lat;
          var lat2 = object.lat;
          var lon1 = this.lng;
          var lon2 = object.lng;
          var R = 6371e3; // metres
          var φ1 = this.toRadians(lat1);
          var φ2 = this.toRadians(lat2);
          var Δφ = this.toRadians(lat2-lat1);
          var Δλ = this.toRadians(lon2-lon1);

          var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

          var d = R * c;

          return d;
      }
      else {
          return 0;
      }
  }

  toRadians(angle) {
      return angle * (Math.PI / 180);
  }

}
