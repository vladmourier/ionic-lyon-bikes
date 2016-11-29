import {Component, ViewChild} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';

import {TabsPage} from '../pages/tabs/tabs';
import {Station} from "../model/Station";
import {StationDrawer} from "../drawings/StationDrawer";
import {StationService} from "../model/StationService";

declare var ol: any;

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  providers: [StationService]
})
export class StationComponent {
  rootPage = TabsPage;
  @ViewChild('map') map;
  stationService: StationService;
  stations: Station[];
  errorMessage: string;

  constructor(stationService: StationService, platform: Platform) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
    this.stationService = stationService;
  }

  requestStations() {
    console.log("Subscribe");
    this.stationService.getStations().subscribe(
      stations => this.setStationsVectorSource(stations),
      error => this.errorMessage = <any>error
    );
  }

  setStationsVectorSource(Stations) {
    console.log("setStations");
    this.stations = [];
    let stationsArray = Stations.values;
    let stationDrawer = new StationDrawer();
    for (let i = 0, l = stationsArray.length; i < l; i++) {
      let station = new Station(stationsArray[i]);
      this.stations.push(station);
      stationDrawer.setStation(station);
      stationDrawer.drawOnSource();
    }


    let layers = stationDrawer.getLayers();
    for (let i = 0, l = layers.length; i < l; i++) {
      this.map.addLayer(layers[i]);
    }

  }

  ngOnInit() {
    this.requestStations();
  }

  ngAfterViewInit() {
    this.map = new ol.Map({
      target: "map",
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      controls: ol.control.defaults().extend([
        new ol.control.ScaleLine(),
        new ol.control.MousePosition({
          coordinateFormat: ol.coordinate.createStringXY(4),
          projection: 'EPSG:4326',
          undefinedHTML: '&nbsp;'
        })
      ]),
      view: new ol.View({
        center: ol.proj.transform([4.85, 45.75], 'EPSG:4326', 'EPSG:3857'),
        zoom: 13
      })
    });
  }


}
