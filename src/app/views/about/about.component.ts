import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data/data.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],

})
export class AboutComponent implements OnInit {
  activeCounters!: number;
  activeCities!: number;


  constructor(
    private dataService: DataService,
  ) { };

  ngOnInit() {
    this.setCounters();
  }

  setCounters() {
    this.dataService.getGlobalData().then((data) => {
      this.activeCities = data.cities;
      this.activeCounters = data.devices;
    }).catch((error) => {
      console.error('Chyba pri získavaní globálnych údajov:', error);
    });
  }
}
