/**
 * Created by Vlad on 25/11/2016.
 */

export class Station {
  number: number;
  name: string;
  address: string;
  address2: string;
  commune: string;
  nmarrond: number;
  bonus: string;
  pole: string;
  lat: number;
  lng: number;
  bike_stands: number;
  status: string;
  available_bike_stands: number;
  available_bikes: number;
  availabilitycode: number;
  availability: string;
  banking: boolean;
  gid: string;
  last_update: string;
  last_update_fme: string;

  constructor (object: any){
    if(object) {
      if(object.number) this.number = object.number;
      if(object.name) this.name = object.name;
      if(object.address) this.address = object.address;
      if(object.address2) this.address2 = object.address2;
      if(object.commune) this.commune = object.commune;
      if(object.nmarrond) this.nmarrond = object.nmarrond;
      if(object.bonus) this.bonus = object.bonus;
      if(object.pole) this.pole = object.pole;
      if(object.lat) this.lat = object.lat;
      if(object.lng) this.lng = object.lng;
      if(object.bike_stands) this.bike_stands = object.bike_stands;
      if(object.status) this.status = object.status;
      if(object.available_bike_stands) this.available_bike_stands = object.available_bike_stands;
      if(object.available_bikes) this.available_bikes = object.available_bikes;
      if(object.availabilitycode) this.availabilitycode = object.availabilitycode;
      if(object.availability) this.availability = object.availability;
      if(object.banking) this.banking = object.banking;
      if(object.gid) this.gid = object.gid;
      if(object.last_update) this.last_update = object.last_update;
      if(object.last_update_fme) this.last_update_fme = object.last_update_fme;
    }
  }
}
