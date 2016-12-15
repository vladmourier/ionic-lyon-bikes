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
    this.styles = {
      'regular': {
        'Point': [new ol.style.Style({
          image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({color: 'white'}),
            stroke: new ol.style.Stroke({color: 'green', width: 3})
          })
        })]
      },
      'empty': {
        'Point': [new ol.style.Style({
          image: new ol.style.Circle({
            radius: 5,
            fill: null,
            stroke: new ol.style.Stroke({color: 'black', width: 3})
          })
        })]
      },
      'full': {
        'Point': [new ol.style.Style({
          image: new ol.style.Circle({
            radius: 5,
            fill: null,
            stroke: new ol.style.Stroke({color: 'red', width: 3})
          })
        })]
      },
    };
    this.sources = {
      'regular': new ol.source.Vector(),
      'full': new ol.source.Vector(),
      'empty': new ol.source.Vector()
    }
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
