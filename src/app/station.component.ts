import {Component, ViewChild} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';

import {TabsPage} from '../pages/tabs/tabs';
import {Station} from "../model/Station";
import {StationDrawer} from "../model/StationDrawer";
import {StationService} from "../model/StationService";

//import {Geolocation} from 'ionic-native';
import {UserLocation} from "../model/UserLocation";
import {UserDrawer} from "../model/UserDrawer";

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
  userLocation: UserLocation;

  constructor(stationService: StationService, platform: Platform) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
    this.stationService = stationService;
    this.userLocation = new UserLocation({});
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
      ]),
      overlays: [],
      view: new ol.View({
        center: ol.proj.transform([4.85, 45.75], 'EPSG:4326', 'EPSG:3857'),
        zoom: 13
      })
    });
    this.handleClickShowPopUp();
    this.addRefreshControl();

    navigator.geolocation.getCurrentPosition(
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

    navigator.geolocation.getCurrentPosition(
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
  }

  /**
   * Get the stations from StationService and treat them accordingly
   */
  requestStations() {
    //console.log("Subscribe");
    this.stationService.getStations().subscribe(
      stations => this.setStationsVectorSource(stations),
      error => this.errorMessage = <any>error
    );
  }

  /**
   * Use the StationArray to draw stations on the map according to their GPS Coordinates and their states.
   * Allow a station to be selected.
   * @param Stations
   */
  setStationsVectorSource(Stations) {
    //console.log("setStations");
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

    console.log("adding and drawing userDrawer");
    let userDrawer = new UserDrawer();
    userDrawer.setUserLocation(this.userLocation);
    userDrawer.drawOnSource();
    this.map.addLayer(userDrawer.getLayer());

    let select = new ol.interaction.Select({
      layers: layers,
      style: new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          fill: null,
          stroke: new ol.style.Stroke({color: 'purple', width: 4})
        })
      })
    });
    this.map.addInteraction(select);

  }

  /**
   * Show a popup on click
   */
  handleClickShowPopUp() {
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    /**
     * Create an overlay to anchor the popup to the map.
     */
    var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    }));

    this.map.addOverlay(overlay);

    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };

    this.map.on('singleclick', function (evt) {
      var coordinate = evt.coordinate;
      var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
        coordinate, 'EPSG:3857', 'EPSG:4326'));

      content.innerHTML = '<p>You clicked here:</p><code>' + hdms +
        '</code>';
      overlay.setPosition(coordinate);
    });
  }

  /**
   * Add a refresh button in order to update stations
   */
  addRefreshControl(){
    var this_ = this;
    /**
     * @constructor
     * @extends {ol.control.Control}
     * @param {Object=} opt_options Control options.
     */
    var refreshControl = function (opt_options) {
      let options = opt_options || {};

      let button = document.createElement('button');
      button.innerHTML = '<ion-icon name="refresh" role="img" class="icon icon-md ion-md-refresh" aria-label="close circle" ng-reflect-name="refresh"></ion-icon>';

      let refresh = function () {
        //console.log("refresh");
        while (this_.map.getLayers().getLength() != 1) {
          this_.map.getLayers().pop();
        }
        this_.requestStations();
      };


      button.addEventListener('click', refresh, false);
      button.addEventListener('touchstart', refresh, false);

      let element = document.createElement('div');
      element.className = 'button-refresh ol-unselectable ol-control';
      element.appendChild(button);

      ol.control.Control.call(this, {
        element: element,
        target: options.target
      });
    };
    ol.inherits(refreshControl, ol.control.Control);

    this.map.addControl(new refreshControl({}));
  }

}
