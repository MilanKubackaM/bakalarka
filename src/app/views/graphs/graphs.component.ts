import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../shared/services/data/data.service';
import { Data } from '../../shared/models/data.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit {
  endDate: Date = new Date();
  startDate: Date = new Date(this.endDate);
  interval: number = 1;
  unit: string = "hours";
  public data: any;
  private longitude!: number;
  private latitude!: number;
  locations: { location: string, url: string }[] = [{ location: 'Automaticky', url: 'urlAutomaticky' }];
  usersData: any;



  constructor(
    private dataService: DataService,
  ) {
    this.startDate.setDate(this.endDate.getDate() - 1);
  }


  ngOnInit() {
    this.selectedLocation = { location: this.locations[0].location, url: ''};
    this.getAllData();
    this.checkCurrentLocation();
    this.createChart();
  }

  getAllData() {
    this.dataService.getAllUserData().subscribe(
      (usersData: any[]) => {
        this.usersData = usersData;
        this.setLocations();
      },
      error => {
        console.error('Chyba pri získavaní údajov o používateľoch:', error);
      }
    );

  }

  setLocations() {
    this.usersData.forEach((device: any) => {
      const location = device.location.city + " - " + device.location.route + " " + device.location.streetNumber;
      this.locations.push({
        location: location,
        url: device.apiUrl
      })
    })
  }


  checkCurrentLocation() {
    this.dataService.checkCurrentLocation()
      .then((location) => {
        this.longitude = location.longitude;
        this.latitude = location.latitude;
      })
      .catch((error) => {
        console.error(error);
      });
  }


  calculateDistance(lat2: number, lon2: number): number {
    const lat1 = this.latitude;
    const lon1 = this.longitude;
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // -----------------------------------------------------------------//
  // -------------------------- C H A R T ----------------------------//
  // -----------------------------------------------------------------//

  public chart: any;
  public selectedLocation!: { location: string, url: string };

  createChart() {
    let url: string = '';
    if (this.selectedLocation.location == "Automaticky") {
      return;
    } else {
      url = this.selectedLocation.url;
    }

    let interval: number = this.chooseUnit();

    this.dataService.getSensorData(url).subscribe((data: Data[]) => {
      const indexedData: { [key: string]: { cyclists: number; temperature: number } } = {};

      for (const dataPoint of data) {
        const dataPointDate = new Date(dataPoint.date);
        const formattedDate = this.formatDate(dataPointDate);
        indexedData[formattedDate] = { cyclists: dataPoint.cyclists, temperature: dataPoint.temperature };
      }

      const startDate = this.startDate;
      const endDate = this.endDate;

      endDate.setHours(23, 59, 59, 999); 

      const dates: string[] = [];
      const cyklisti: number[] = [];
      const teploty: number[] = [];

      let currentIntervalStart = new Date(startDate);

      while (currentIntervalStart <= endDate) {
        const currentIntervalEnd = new Date(currentIntervalStart.getTime() + interval * 60 * 1000);

        let sumCyclists = 0;
        let sumTemperature = 0;
        let count = 0;

        for (const key in indexedData) {
          const dataPointDate = new Date(key);
          if (dataPointDate >= currentIntervalStart && dataPointDate < currentIntervalEnd) {
            sumCyclists += indexedData[key].cyclists;
            sumTemperature += indexedData[key].temperature;
            count++;
          }
        }

        const averageCyclists = count > 0 ? sumCyclists / count : 0;
        const averageTemperature = count > 0 ? sumTemperature / count : 0;

        dates.push(this.formatDate(currentIntervalStart));
        cyklisti.push(averageCyclists);
        teploty.push(averageTemperature);
        currentIntervalStart.setTime(currentIntervalEnd.getTime());
      }

      if (this.chart) {
        this.updateChart(dates, cyklisti, teploty);
      } else {
        this.createNewGraph(dates, cyklisti, teploty);
      }
    });
  }

  updateChart(dates: any, cyklisti: any, teploty: any){
    this.chart.data.labels = dates;
    this.chart.data.datasets[0].data = cyklisti;
    this.chart.data.datasets[1].data = teploty;
    this.chart.update();
  }

  createNewGraph(dates: any, cyklisti: any, teploty: any){
    this.chart = new Chart("MyChart", {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: "Cyklisti",
            data: cyklisti,
            backgroundColor: 'blue'
          },
          {
            label: "Teplota",
            data: teploty,
            backgroundColor: 'red'
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    })
  }

  chooseUnit(){
    switch (this.unit) {
      case 'seconds':
        return this.interval / 60; 
      case 'minutes':
        return this.interval; 
      case 'hours':
        return this.interval * 60; 
      case 'days':
        return this.interval * 24 * 60;
      default:
        return 60; 
    }
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

}


