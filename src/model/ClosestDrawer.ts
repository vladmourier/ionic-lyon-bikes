import {Station} from "./station/Station"

declare var ol: any;

export class ClosestDrawer {
  station: Station;
  style: any;
  source: any;
  layer: any;

  constructor() {
    var self = this;
    this.style = { 'Point': function(feature, resolution){
      return [new ol.style.Style({
        image: new ol.style.Circle({
          radius: self.getRadiusAccordingToResolution(resolution) + 3,
          stroke: new ol.style.Stroke({color: 'pink', width: 10})
        })
      })]
}};

    this.source = new ol.source.Vector()

    this.layer = new ol.layer.Vector({
        source: this.source,
        style: this.style['Point']
    });
  }

  setStation(s: Station) {
    this.station = s;
  }

  public getOLFeature() {
    return new ol.Feature(
      new ol.geom.Point(
        ol.proj.transform(
          [
            Math.abs(this.station.lng),
            Math.abs(this.station.lat)
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
