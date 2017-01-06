/**
 * Created by Vlad on 25/11/2016.
 */

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
      console.log("setting location");
    if(object) {
        console.log("from object");
      if(object.latitude) this.lat = object.latitude;
      if(object.longitude) this.lng = object.longitude;
    }
    else {
        console.log("from default");
        this.lat = 0;
        this.lng = 0;
    }
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
