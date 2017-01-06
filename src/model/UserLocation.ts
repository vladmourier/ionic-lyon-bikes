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
      var temp = ol.proj.transform([this.lng, this.lat], 'EPSG:4326', 'EPSG:3857');
      //console.log(temp)
      return temp;
  }

}

/*



let watch = navigator.geolocation.watchPosition(
    (pos) => {
        console.log("ca fait GCP Success");
        this.userLocation.setLocation(pos.coords);
        console.log("Coordonnees : " + this.userLocation.lat + ', ' + this.userLocation.lng);
    },
    (err) => {
        console.log("ca fait GCP Error");
        console.log(err.message)
    },
    {timeout: 5000}
);

*/
