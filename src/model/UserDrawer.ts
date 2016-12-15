import {UserLocation} from "./UserLocation"

declare var ol: any;

export class UserDrawer {
  userLocation: UserLocation;
  styles: any;
  sources: any;
  layer: any;

  constructor() {
    this.styles = {
      'regular': {
        'Point': [new ol.style.Style({
          image: new ol.style.Circle({
            radius: 40,
            fill: null,
            stroke: new ol.style.Stroke({color: 'blue', width: 10})
          })
        })]
      }
    };

    this.sources = {
      'regular': new ol.source.Vector()
    }

    this.layer = new ol.layer.Vector({
        source: this.sources.regular,
        style: this.styles.regular['Point']
    });
  }

  setUserLocation(ul: UserLocation) {
    this.userLocation = ul;
  }

  public getOLFeature() {
    return new ol.Feature(
      new ol.geom.Point(
        ol.proj.transform(
          [
            Math.abs(this.userLocation.lng),
            Math.abs(this.userLocation.lat)
          ],
          'EPSG:4326', 'EPSG:3857'))
    );
  }

  public drawOnSource() {
    this.sources.regular.addFeature(this.getOLFeature());
    console.log("drawed");
  }

  public getLayer() {
    return this.layer;
  }
}
