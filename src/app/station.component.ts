import {Component, ViewChild} from '@angular/core';
import {Platform, NavController} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {Storage} from '@ionic/storage'
import {TabsPage} from '../pages/tabs/tabs';
import {Station} from "../model/Station";
import {StationDrawer} from "../model/StationDrawer";
import {StationService} from "../model/StationService";
import {StationPage} from "../pages/station/station";

//import {Geolocation} from 'ionic-native';
import {UserLocation} from "../model/UserLocation";
import {UserDrawer} from "../model/UserDrawer";

declare var ol: any;

@Component({
  template: `<ion-nav #myNav [root]="rootPage"></ion-nav>`,
  providers: [StationService, Storage]
})
export class StationComponent {
  public static readonly INITIAL_COORDINATES = ol.proj.transform([4.85, 45.75], 'EPSG:4326', 'EPSG:3857');
  public static readonly INITIAL_ZOOM_LEVEL = 13;
  rootPage = TabsPage;
  @ViewChild('map') map;
  stationService: StationService;
  stations: Station[];
  currentStation: Station;
  @ViewChild('myNav') nav: NavController;
  errorMessage: string;
  userLocation: UserLocation;
  private storage: Storage;
  private view: any;


  constructor(stationService: StationService, storage: Storage, platform: Platform) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
    this.stationService = stationService;
    this.storage = storage;
  }

  ngOnInit() {
    this.getAndDrawPosition();
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
      view: this.view = new ol.View({
        center: StationComponent.INITIAL_COORDINATES,
        zoom: StationComponent.INITIAL_ZOOM_LEVEL/*,
        minZoom: 10,
        maxZoom: 20*/
      })
    });
    this.addRefreshControl();
    this.addCenterRelocationControl();
  }

  ionViewDidLoad() {
      console.log("test");
  }

  /**
   * Get the stations from StationService and treat them accordingly
   */
  requestStations() {
    //console.log("Subscribe");
    this.stationService.getStations().subscribe(
      stations => this.setStationsVectorSource(stations),
      error => this.drawFromLocalStorage(error)
    );
  }

  getAndDrawPosition() {
      this.userLocation = new UserLocation({});
      navigator.geolocation.getCurrentPosition( // ou plugin cordova
          (pos) => {
              this.userLocation.setLocation(pos.coords);
              console.log("adding and drawing userDrawer");
              let userDrawer = new UserDrawer();
              userDrawer.setUserLocation(this.userLocation);
              userDrawer.drawOnSource();
              this.map.addLayer(userDrawer.getLayer());
          },
          (err) => {
              console.log("GCP Error");
              console.log(err.message)
          },
          {timeout: 5000}
      );
  }

  /**
   * Use the StationArray to draw stations on the map according to their GPS Coordinates and their states.
   * Allow a station to be selected.
   * @param Stations
   */
  setStationsVectorSource(Stations) {
    console.log("setStations");
    var self = this;
    this.stations = [];
    let stationsArray = Stations.values;
    let stationDrawer = new StationDrawer();
    console.log("adding and drawing stations");
    //draws stations on different layers according to their state
    for (let i = 0, l = stationsArray.length; i < l; i++) {
      let station = new Station(stationsArray[i]);
      // this.stations.push(station);
      this.stations[station.number] = station;
      this.drawStation(station, stationDrawer);
    }

    //Add the layers to the map
    this.addLayersToMap(stationDrawer);
    let layers = stationDrawer.getLayers();

    //Creates the interaction allowing selecting the stations
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
    //Create the select object which handles station features click
    select.on("select", function (selectedItem) {
      console.log(selectedItem);
      let stationNumber = selectedItem.selected[0].get("number");
      self.currentStation = self.stations[stationNumber];
      self.nav.push(StationPage, self.currentStation);
    });

    this.map.addInteraction(select);

    //adds the stations to local storage
    this.storage.set('stations', JSON.stringify(this.stations, function (k, v) {
      if (v instanceof Array) {
        var o = {};
        for (var ind in v) {
          if (v.hasOwnProperty(ind)) {
            o[ind] = v[ind];
          }
        }
        return o;
      }
      return v;
    }));
  }

  /**
   * Add a refresh button in order to update stations
   */
  addRefreshControl() {
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
        this_.getAndDrawPosition();
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

  /**
   * Adds a relocate button centering the view on the default coordinates with the default zoom level
   */
  addCenterRelocationControl() {
    var self = this;
    /**
     * @constructor
     * @extends {ol.control.Control}
     * @param {Object=} opt_options Control options.
     */
    var relocateControl = function (opt_options) {
      let options = opt_options || {};

      let button = document.createElement('button');
      button.innerHTML = '<ion-icon name="locate" role="img" class="icon icon-md ion-md-locate" aria-label="close circle" ng-reflect-name="locate"></ion-icon>';

      let relocate = function () {
          let temp = self.userLocation.getLocation();
          //let temp = StationComponent.INITIAL_COORDINATES;
          //console.log(temp);
        self.view.animate({
          center: temp,
          zoom: StationComponent.INITIAL_ZOOM_LEVEL,
          duration: 1000
        });
      };

      button.addEventListener('click', relocate, false);
      button.addEventListener('touchstart', relocate, false);

      let element = document.createElement('div');
      element.className = 'button-relocate ol-unselectable ol-control';
      element.appendChild(button);

      ol.control.Control.call(this, {
        element: element,
        target: options.target
      });
    };
    ol.inherits(relocateControl, ol.control.Control);

    this.map.addControl(new relocateControl({}));
  }

  /**
   * Draws the stations from locally stored data
   * @param PrevError
   */
  drawFromLocalStorage(PrevError) {
    var self = this;
    if (PrevError)
      this.errorMessage = <any>PrevError;
    this.storage.get('stations').then(function (res) {
        let stationDrawer = new StationDrawer();
        self.stations = JSON.parse(res);
        console.log("Stations drawn from local storage");
        for (let sta in self.stations)
          self.drawStation(self.stations[sta], stationDrawer)

        self.addLayersToMap(stationDrawer);
      }
    );
  }

  drawStation(station, stationDrawer) {
    stationDrawer.setStation(station);
    stationDrawer.drawOnSource();
  }

  addLayersToMap(stationDrawer) {
    //Ajoute les layers à la map
    let layers = stationDrawer.getLayers();
    for (let i = 0, l = layers.length; i < l; i++) {
      this.map.addLayer(layers[i]);
    }
  }

}
