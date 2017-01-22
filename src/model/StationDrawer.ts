import {Station} from "./Station";


declare var ol: any;

const EMPTY = "empty";
const FULL = "full";
const REGULAR = "regular";

export class StationDrawer {
  station: Station;
  styles: any;
  sources: any;
  layers: any;

  constructor() {
    var self = this;
    this.styles = {
      'regular': {
        'Point': function(feature, resolution){
          return [new ol.style.Style({
            image: new ol.style.Circle({
              radius: self.getRadiusAccordingToResolution(resolution) ,
              fill: new ol.style.Fill({color: 'white'}),
              stroke: new ol.style.Stroke({color: 'green', width: 3})
          })
          })]
        }
      },
      'empty': {
        'Point': function(feature, resolution){
          return [new ol.style.Style({
            image: new ol.style.Circle({
              radius: self.getRadiusAccordingToResolution(resolution) ,
              fill: new ol.style.Fill({color: 'white'}),
              stroke: new ol.style.Stroke({color: 'black', width: 3})
            })
          })]
        }
      },
      'full': {
        'Point': function(feature, resolution){
          return [new ol.style.Style({
            image: new ol.style.Circle({
              radius: self.getRadiusAccordingToResolution(resolution) ,
              fill: new ol.style.Fill({color: 'white'}),
              stroke: new ol.style.Stroke({color: 'red', width: 3})
            })
          })]
        }
      },
    };
    this.sources = {
      'regular': new ol.source.Vector({
        zIndex: 100
      }),
      'full': new ol.source.Vector({
        zIndex: 100
      }),
      'empty': new ol.source.Vector({
        zIndex: 100
      })
    }
  }

  private getRadiusAccordingToResolution(resolution){
    return resolution > 15 ? 15 : Math.max(8, resolution*0.5);
  }

  setStation(station: Station) {
    this.station = station;
  }

  getStyle(state: string) {
    return this.styles[state];
  }

  getStationStyle() {
    return this.styles[this.getStationState()];
  }

  private getStationState() {
    if (this.station.available_bikes === this.station.available_bike_stands) {
      return FULL;
    } else if (this.station.available_bikes === 0) {
      return EMPTY;
    }
    return REGULAR;
  }

  public getOLFeature() {
    let lng = Math.abs(this.station.lng);
    let lat = Math.abs(this.station.lat);
    let feature = new ol.Feature(
      new ol.geom.Point(
        ol.proj.transform(
          [
            lng,
            Math.abs(lat)
          ],
          'EPSG:4326', 'EPSG:3857'))
    );
    feature.set('number', this.station.number);
    return feature;
  }

  public drawOnSource() {
    this.sources[this.getStationState()].addFeature(this.getOLFeature());
    console.log("drawed stations");
  }

  public getStylefunction() {
    return this.getStationStyle()["Point"];
  }

  public getLayers() {
    let layers = [];

    if (this.sources.regular.getFeatures().length > 0) {
      layers.push(new ol.layer.Vector({
          source: this.sources.regular,
          style: this.styles.regular['Point']
        })
      );
    }

    if (this.sources.empty.getFeatures().length > 0) {
      layers.push(new ol.layer.Vector({
          source: this.sources.empty,
          style: this.styles.empty['Point']
        })
      );
    }

    if (this.sources.full.getFeatures().length > 0) {
      layers.push(new ol.layer.Vector({
          source: this.sources.full,
          style: this.styles.full['Point']
        })
      );
    }

    return layers;
  }

}
