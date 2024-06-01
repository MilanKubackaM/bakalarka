import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AddressData } from 'src/app/shared/models/data.model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})

export class MapComponent implements OnInit {
  map!: google.maps.Map;
  marker!: google.maps.Marker;
  @Output() locationChange = new EventEmitter<AddressData>();

  constructor() { }

  ngOnInit() {
    this.initMap();
  }


  initMap() {
    const initialPosition = { lat: 48.148598, lng: 17.107748 };
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: initialPosition,
      zoom: 10
    });

    google.maps.event.addListener(this.map, 'click', (event) => {
      this.placeMarker(event.latLng);
      this.getClickedLocationAddress(event.latLng);
    });
  }

  getClickedLocationAddress(latLng: google.maps.LatLng) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          const addressComponents = results[0].address_components;
          let streetNumber = '';
          let route = '';
          let latitude = latLng.lat();
          let longitude = latLng.lng();
          let city = '';

          addressComponents.forEach(component => {
            if (component.types.includes('locality') && city == '') {
              city = component.long_name;
            }
            if (component.types.includes('street_number') && streetNumber == '') {
              streetNumber = component.long_name;
            }
            if (component.types.includes('route') && route == '') {
              route = component.long_name;
            }
          });

          if ((city == '') || (streetNumber == '') || (route == '')) {
            const addressComponents2 = results[0].address_components;
            addressComponents2.forEach(component => {
              if (component.types.includes('locality') && city == '') {
                city = component.long_name;
              }
              if (component.types.includes('street_number') && streetNumber == '') {
                streetNumber = component.long_name;
              }
              if (component.types.includes('route') && route == '') {
                route = component.long_name;
              }
            });
          }

          const addressData: AddressData = {
            route: route,
            streetNumber: streetNumber,
            latitude: latitude,
            longitude: longitude,
            city: city
          };
          this.locationChange.emit(addressData);

        } else {
          console.error('No results found');
        }
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });
  }

  placeMarker(location: google.maps.LatLng) {
    if (this.marker) {
      this.marker.setMap(null); // Odstrániť predchádzajúci marker
    }
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map
    });
  }
}