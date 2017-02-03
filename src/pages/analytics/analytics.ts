import {Component} from '@angular/core';

import {NavController} from 'ionic-angular';
import {StationWorker} from "../../app/StationWorker";
import Highcharts from "highcharts";
import highcharts_export from "highcharts/modules/exporting";
@Component({
  selector: 'page-analytics',
  templateUrl: 'analytics.html'
})
export class AnalyticsPage extends StationWorker {

  totalBikeStands;

  constructor(public navCtrl: NavController) {
    super(navCtrl);
// Load module after Highcharts is loaded
    highcharts_export(Highcharts);
  }

  ionViewDidLoad() {
    // Create the chart
    this.stationsPerTownChart();
    this.bankingStationsChart();
    this.bonusStationsChart();
  }

  ngOnInit() {
    this.initStations();
    this.totalBikeStands = this.getTotalBikeStands()
  }


  private getBankingStations() {
    let _bankingStations = 0;
    for (let sta in this.stations) {
      let station = this.stations[sta];
      _bankingStations += station.banking ? 1 : 0;
    }
    return _bankingStations;
  }

  private bankingStationsChart() {
    let bankingStations = this.getBankingStations();
    Highcharts.chart('banking-stations',
      {
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


  private stationsPerTownChart() {
    let stationsPerTown = this.getStationsPerTown();
    Highcharts.chart('stations-per-town', {
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
    stationsPerTown.sort(function (a,b){//Sort by number of stations
      return a[1]-b[1];
    });
    return stationsPerTown;
  }

  private getTotalBikeStands() {
    let bikeStands = 0;
    for (let sta in this.stations) {
      let station = this.stations[sta];
      bikeStands +=  station.bike_stands;
    }
    return bikeStands;
  }
}
