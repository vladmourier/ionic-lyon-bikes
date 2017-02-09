import {Component, ViewChild} from '@angular/core';
import {Storage} from '@ionic/storage'
import {NavController} from 'ionic-angular';
import {StationPage} from "../station/station";
import {StationService} from "../../model/station/StationService";
import {UserLocation} from "../../model/user/UserLocation";
import {Station} from "../../model/station/Station";
import {BikeTrackService} from "../../model/tracks/BikeTrackService";
import {UserDrawer} from "../../model/user/UserDrawer";
import {ClosestDrawer} from "../../model/ClosestDrawer";
import {StationDrawer} from "../../model/station/StationDrawer";
declare var ol: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public static stationToGo: Station;
  public static readonly INITIAL_COORDINATES = ol.proj.transform([4.85, 45.75], 'EPSG:4326', 'EPSG:3857');
  public static readonly INITIAL_ZOOM_LEVEL = 13;

  @ViewChild('map') map;
  stations: Station[];
  currentStation: Station;
  errorMessage: string;
  userLocation: UserLocation;
  private view: any;

  constructor(public stationService: StationService, public storage: Storage, public bikeTrackService: BikeTrackService, public nav: NavController) {
  }

  ngOnInit() {
    this.requestStations();
    this.requestBikeTracks();
  }

  ngAfterViewInit(){
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
        center: HomePage.INITIAL_COORDINATES,
        zoom: HomePage.INITIAL_ZOOM_LEVEL,
        minZoom: 10,
        maxZoom: 20
      })
    });
    this.addRefreshControl();
    this.addCenterRelocationControl();
  }

  ionViewWillEnter() {
    if (typeof HomePage.stationToGo !== "undefined") {
      this.view.animate({
        center: ol.proj.transform([
          HomePage.stationToGo.lng,
          Math.abs(HomePage.stationToGo.lat)
        ], 'EPSG:4326', 'EPSG:3857'),
        zoom: 17,
        duration: 1000
      });
      setTimeout(() => {
        this.nav.push(StationPage, HomePage.stationToGo);
        delete HomePage.stationToGo;
      }, 1100);
    }
  }

  /**
   * Get the stations from StationService and treat them accordingly
   */
  private requestStations() {
    //console.log("Subscribe");
    this.stationService.requestStations().subscribe(
      stations => {
        this.setStationsVectorSource(stations);
        this.getAndDrawPosition();
      },
      error => {
        this.drawFromLocalStorage(error);
        this.getAndDrawPosition();
      }
    );
  }

  getAndDrawPosition() {
    this.userLocation = new UserLocation({});
    navigator.geolocation.getCurrentPosition( // ou plugin cordova
      (pos) => {
        this.userLocation.setLocation(pos.coords);
        let userDrawer = new UserDrawer();
        userDrawer.setUserLocation(this.userLocation);
        userDrawer.drawOnSource();
        this.map.addLayer(userDrawer.getLayer());
        userDrawer.getLayer().setZIndex(20);
        this.drawClosestStation();
      },
      (err) => {
        //console.log("GCP Error");
        console.log(err.message)
      },
      {timeout: 5000}
    );
  }

  drawClosestStation() {
    var closest = this.stations[0];
    var minDist = this.userLocation.distanceTo(this.stations[0]);
    for (let sta in this.stations) {
      var dist = this.userLocation.distanceTo(this.stations[sta]);
      if (typeof closest == "undefined" || dist < minDist) {
        closest = this.stations[sta];
        minDist = dist;
      }
    }
    let closestDrawer = new ClosestDrawer();
    closestDrawer.setStation(closest);
    closestDrawer.drawOnSource();
    this.map.addLayer(closestDrawer.getLayer());
    closestDrawer.getLayer().setZIndex(10);
  }

  /**
   * Gets the tracks information and treat them accordingly
   */
  private requestBikeTracks() {
    this.bikeTrackService.requestTracks().subscribe(
      tracksFeatureCollection => {
        this.map.addLayer(new ol.layer.Vector({
          source: new ol.source.Vector({
            features: (new ol.format.GeoJSON({featureProjection: 'EPSG:3857'})).readFeatures(tracksFeatureCollection),
          }),
          style: new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: '#007A33',
              width: 3
            }),
            zIndex: 0
          })
        }));
      },
      error => {
        //TODO : load from localStorage
      }
    )
  }

  /**
   * Use the StationArray to draw stations on the map according to their GPS Coordinates and their states.
   * Allow a station to be selected.
   * @param Stations
   */
  private setStationsVectorSource(Stations) {
    // console.log("setStations");
    var self = this;
    this.stations = [];
    let stationsArray = Stations.values;
    let stationDrawer = new StationDrawer();
    //draws stations on different layers according to their state
    for (let i = 0, l = stationsArray.length; i < l; i++) {
      let station = new Station(stationsArray[i]);
      // this.stations.push(station);
      this.stations[station.number] = station;
      this.drawStation(station, stationDrawer);
    }

    //Sets the service array for future use
    StationService.stations = this.stations;

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

    //Setup click selection of the stations
    this.map.on('click', function (event) {
      let clickedStations = [];
      self.map.forEachFeatureAtPixel(event.pixel,
        (feature, layer) => {
          let stationNumber = feature.get("number");
          if (typeof stationNumber !== "undefined")
            clickedStations.push(self.stations[stationNumber]);//Store clicked stations
        });
      if (clickedStations.length > 0) {
        self.currentStation = clickedStations[clickedStations.length > 1 ? Math.floor(Math.random() * clickedStations.length) : 0];//Render one randomly
        self.nav.push(StationPage, self.currentStation);
      }
    });

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
  private addRefreshControl() {
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
        this_.requestBikeTracks();
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
  private addCenterRelocationControl() {
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
        self.view.animate({
          center: temp,
          zoom: HomePage.INITIAL_ZOOM_LEVEL,
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
  private drawFromLocalStorage(PrevError) {
    var self = this;
    if (PrevError)
      this.errorMessage = <any>PrevError;
    this.storage.get('stations').then(function (res) {
        let stationDrawer = new StationDrawer();
        self.stations = JSON.parse(res);

        //Sets the service array for future use
        StationService.stations = self.stations;

        for (let sta in self.stations)
          self.drawStation(self.stations[sta], stationDrawer)

        self.addLayersToMap(stationDrawer);
      }
    );
  }

  private drawStation(station, stationDrawer) {
    stationDrawer.setStation(station);
    stationDrawer.drawOnSource();
  }

  private addLayersToMap(stationDrawer) {
    //Ajoute les layers à la map
    let layers = stationDrawer.getLayers();
    for (let i = 0, l = layers.length; i < l; i++) {
      this.map.addLayer(layers[i]);
      layers[i].setZIndex(10);
    }
  }
}
