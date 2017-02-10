import {Component} from '@angular/core';

import {NavController, LoadingController, Loading} from 'ionic-angular';
import {StationWorker} from "../../app/StationWorker";
import Highcharts from "highcharts";
import highcharts_export from "highcharts/modules/exporting";
@Component({
  selector: 'page-analytics',
  templateUrl: 'analytics.html'
})
export class AnalyticsPage extends StationWorker {

  totalBikeStands;
  private loading: Loading;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController) {

    super(navCtrl);
    // Load module after Highcharts is loaded
    highcharts_export(Highcharts);
  }

  ionViewDidLoad() {
    // Create the chart
    this.stationsPerTownChart();
    this.bankingStationsChart();
    this.bonusStationsChart();
    this.AverageBikeStandsPerStationInTownChart();
    this.standsAvailabilityRatePerTownChart();
    this.bikesAvailablePerTownChart();
    this.loading.dismiss();
  }

  ngOnInit() {
    this.loading = this.loadingCtrl.create({
      content: "Analyse du flux d'informations..."
    });
    this.loading.present();
    this.initStations();
    this.totalBikeStands = this.getTotalBikeStands()
  }

  private bankingStationsChart() {
    let bankingStations = this.getBankingStations();
    Highcharts.chart('banking-stations',
      {
        exporting: {enabled: false},
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: 'Proportion de stations avec TPE'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
          name: 'Pourcentage',
          colorByPoint: true,
          data: [{
            name: 'Stations avec TPE',
            y: bankingStations
          },
            {
              name: "Autres",
              y: this.stations.length - bankingStations
            }]
        }]
      });
  }

  private bonusStationsChart() {
    let bonusStations = this.getBonusStations();
    Highcharts.chart('bonus-stations',
      {
        exporting: {enabled: false},
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: 'Proportion de stations bonus'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
          name: 'Pourcentage',
          colorByPoint: true,
          data: [{
            name: 'Stations bonus',
            y: bonusStations
          },
            {
              name: "Autres",
              y: this.stations.length - bonusStations
            }]
        }]
      });
  }

  private getBonusStations() {
    let _bonuStations = 0;
    for (let sta in this.stations) {
      let station = this.stations[sta];
      _bonuStations += station.bonus === "Oui" ? 1 : 0;
    }
    return _bonuStations;
  }

  private getBankingStations() {
    let _bankingStations = 0;
    for (let sta in this.stations) {
      let station = this.stations[sta];
      _bankingStations += station.banking ? 1 : 0;
    }
    return _bankingStations;
  }

  private stationsPerTownChart() {
    let stationsPerTown = this.getStationsPerTown();
    Highcharts.chart('stations-per-town', {
      exporting: {enabled: false},
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      title: {
        text: 'Stations par commune',
        align: 'center',
        verticalAlign: 'top',
      },
      tooltip: {
        pointFormat: 'Stations : <b>{point.y}</b>'
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: 30,
            style: {
              fontWeight: 'bold',
              color: '#222'
            }
          },
        }
      },
      series: [{
        type: 'pie',
        name: 'Stations par commune',
        innerSize: '50%',
        data: stationsPerTown
      }]
    });
  }

  private getStationsPerTown() {
    let _stationsPerTown = [];
    for (let sta in this.stations) {
      let station = this.stations[sta];
      if (typeof _stationsPerTown[station.commune] === 'undefined') {
        _stationsPerTown[station.commune] = 1;
      } else {
        _stationsPerTown[station.commune] = _stationsPerTown[station.commune] + 1;
      }
    }
    let stationsPerTown = [];
    for (let obj in _stationsPerTown) {
      stationsPerTown.push([obj, _stationsPerTown[obj]]);
    }
    stationsPerTown.sort((a, b) => a[1] - b[1]);
    return stationsPerTown;
  }

  private getTotalBikeStands() {
    let bikeStands = 0;
    for (let sta in this.stations) {
      let station = this.stations[sta];
      bikeStands += station.bike_stands;
    }
    return bikeStands;
  }

  private AverageBikeStandsPerStationInTownChart() {
    let serie: any = {
      name: "Communes",
      dataLabels: {
        enabled: true,
        rotation: -90,
        color: '#FFFFFF',
        align: 'right',
        format: '{point.y:.1f}', // one decimal
        y: 10, // 10 pixels down from the top
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      },
      color: '#E11F26'
    };
    let data = [];

    let sideData = {};

    //Computes the number of bikestands per town
    this.stations.forEach((station) =>{
      if(typeof sideData[station.commune] !== "undefined"){
        data[sideData[station.commune].index][1] += station.bike_stands;
        sideData[station.commune].count += 1;
      } else {
        data.push([station.commune, station.bike_stands]);
        sideData[station.commune] = {
          index: data.findIndex((array) => array[0] === station.commune),
          count: 1
        }
      }
    });
    //Computes the average
    data.forEach((array) => {
      array[1] /= sideData[array[0]].count;
    });
    serie.data = data.sort();
    let series = [serie];

    Highcharts.chart('bikestands-per-town', {
      exporting: {enabled: false},
      chart: {
        type: 'column'
      },
      title: {text: 'Nb moyen d\'emplacements par station par commune'},
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Nombre d\'emplacements'
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> emplacements'
      },
      series: series
    })
  }

  private standsAvailabilityRatePerTownChart() {
    let serie: any = {
      name: "Communes",
      dataLabels: {
        enabled: true,
        rotation: -90,
        color: '#FFFFFF',
        align: 'right',
        format: '{point.y:.1f}', // one decimal
        y: 10, // 10 pixels down from the top
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      },
      color: '#E11F26'
    };
    let data = [];

    let sideData = {};

    //Computes the number of bikestands & available_bike_stands per town
    this.stations.forEach((station) =>{
      if(typeof sideData[station.commune] !== "undefined"){
        data[sideData[station.commune].index][1] += station.bike_stands;
        data[sideData[station.commune].index][2] += station.available_bike_stands;
        sideData[station.commune].count += 1;
      } else {
        data.push([station.commune, station.bike_stands, station.available_bike_stands]);
        sideData[station.commune] = {
          index: data.findIndex((array) => array[0] === station.commune),
          count: 1
        }
      }
    });
    //Computes the average
    data.forEach((array) => {
      array[1] = (array[2]/array[1]);
    });
    serie.data = data.sort();
    let series = [serie];

    Highcharts.chart('available-stands-per-town', {
      exporting: {enabled: false},
      chart: {
        type: 'column'
      },
      title: {text: 'Proportion de stands disponibles par commune'},
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Nombre d\'emplacements'
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> % de stands disponibles'
      },
      series: series
    })
  }

  private bikesAvailablePerTownChart() {
    let serie: any = {
      name: "Communes",
      dataLabels: {
        enabled: true,
        rotation: -90,
        color: '#FFFFFF',
        align: 'right',
        format: '{point.y:.1f}', // one decimal
        y: 10, // 10 pixels down from the top
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      },
      color: '#E11F26',
      minPointLength: 3
    };
    let data = [];

    let sideData = {};

    //Computes the number of available bikes per town
    this.stations.forEach((station) =>{
      if(typeof sideData[station.commune] !== "undefined"){
        data[sideData[station.commune].index][1] += station.available_bikes;
        sideData[station.commune].count += 1;
      } else {
        data.push([station.commune, station.available_bikes]);
        sideData[station.commune] = {
          index: data.findIndex((array) => array[0] === station.commune),
          count: 1
        }
      }
    });

    serie.data = data.sort();
    let series = [serie];

    Highcharts.chart('available-bikes-per-town', {
      exporting: {enabled: false},
      chart: {
        type: 'column'
      },
      title: {text: 'Vélos disponibles par commune'},
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Nombre d\'emplacements'
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> vélos disponibles'
      },
      series: series
    })
  }
}
