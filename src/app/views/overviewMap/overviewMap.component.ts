import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/shared/services/weather/weather.service';
import { DataService } from 'src/app/shared/services/data/data.service';
import { Location } from 'src/app/shared/models/data.model';
import { forkJoin, map } from 'rxjs';


@Component({
  selector: 'app-overviewMap',
  templateUrl: './overviewMap.component.html',
  styleUrls: ['./overviewMap.component.css']
})
export class OverviewMapComponent implements OnInit {
  map!: google.maps.Map;
  locations: Location[] = [];
  markers: google.maps.Marker[] = [];
  infoWindow: google.maps.InfoWindow = new google.maps.InfoWindow();

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.initMap();
  }


  initMap() {
    const initialPosition = { lat: 48.148598, lng: 17.107748 };
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: initialPosition,
      zoom: 12
    });

    this.getUserData().then((data: any) => {
      this.getSensorData(this.locations).then((data: any) => {
        this.createMarkers(data);
      }).catch(error => {
        console.error('Chyba pri získavaní údajov zo senzorov:', error);
      });

    }).catch(error => {
      console.error('Chyba pri získavaní údajov o uzivateloch:', error);
    });
  }


  getUserData(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.dataService.getAllUserData().subscribe(data => {
        const locations = this.setLocations(data);
        this.locations = locations;
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  getSensorData(locations: Location[]): Promise<any[]> {
    const observables = locations.map((location: Location) => {
      return this.dataService.getSensorData(location.url).pipe(
        map(data => ({
          deviceName: location.deviceName,
          latitude: location.latitude,
          longitude: location.longitude,
          data: this.findDataForToday(data)
        }))
      );
    });

    return new Promise<any[]>((resolve, reject) => {
      forkJoin(observables).subscribe(
        (results: any[]) => {
          resolve(results);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  findDataForToday(data: any) {
    let dataForToday = 0;
    const today = new Date().getDate();

    data.forEach((entry: any) => {
      const entryDate = new Date(entry.date).getDate();
      if (entryDate === today) {
        dataForToday = entry.cyclists;
      }
    });
    return dataForToday;
  }

  createMarkers(locations: Location[]) {
    const markers: google.maps.Marker[] = [];
    locations.forEach((location: Location) => {
      const lat = parseFloat(location.latitude);
      const lng = parseFloat(location.longitude);
      const position = { lat, lng };
      const title = location.deviceName;
      const marker = new google.maps.Marker({
        position: position,
        map: this.map,
        title: title
      });
      this.appendInfoWindow(marker, location)
      markers.push(marker);
    });
    return markers;
  }

  appendInfoWindow(marker: google.maps.Marker, location: any) {
    const infoWindow = new google.maps.InfoWindow({
      content: this.createContentForInfo(location.deviceName || "Nazov neznamy", "Dnesny pocet prejazdov: ", "ieco dalsie", location.data)
    });

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });
  }


  setLocations(data: any) {
    let locations: any = [];
    data.forEach((device: any) => {
      const location = device.location.city + " - " + device.location.route + " " + device.location.streetNumber;
      locations.push({
        deviceName: device.name,
        location: location,
        longitude: device.location.longitude,
        latitude: device.location.latitude,
        url: device.apiUrl
      });
    });
    return locations;
  }

  createContentForInfo(heading: string, body: string, footer: string, cyclists: number) {
    const contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<h1 id="firstHeading" class="firstHeading">' + heading + '</h1>' +
      '<div id="bodyContent">' +
      "<p><b>" + body + cyclists + "</b>" +
      "</div>" +
      "</div>";

    return contentString;
  }

}
