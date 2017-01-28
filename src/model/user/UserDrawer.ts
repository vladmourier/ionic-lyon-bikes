import {UserLocation} from "./UserLocation"

declare var ol: any;

export class UserDrawer {
  userLocation: UserLocation;
  style: any;
  source: any;
  layer: any;

  constructor() {
    var self = this;
    this.style = { 'Point': function(feature, resolution){
      return [new ol.style.Style({
        image: new ol.style.Circle({
          radius: self.getRadiusAccordingToResolution(resolution),
          stroke: new ol.style.Stroke({color: 'blue', width: 10})
        })
      })]
}};
    this.style = {
        'Point': [new ol.style.Style({
          image: new ol.style.Circle({
            radius: 4,
            fill: null,
            stroke: new ol.style.Stroke({color: 'blue', width: 10})
          })
        })]
    };

    this.source = new ol.source.Vector()

    this.layer = new ol.layer.Vector({
        source: this.source,
        style: this.style['Point'],
        zIndex: 1
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
    this.source.addFeature(this.getOLFeature());
  }

  public getLayer() {
    return this.layer;
  }

  private getRadiusAccordingToResolution(resolution){
    return resolution > 15 ? 20 : Math.max(15, resolution);
  }

}
