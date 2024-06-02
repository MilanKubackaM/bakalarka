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
    this.dataService.getAllUserData().subscribe((res: any) => {
      const cityCount: { [city: string]: number } = {};

      res.forEach((record: any) => {
        const city = record.location.city;
        if (cityCount[city]) {
          cityCount[city]++;
        } else {
          cityCount[city] = 1;
        }
      });

      this.activeCities = Object.keys(cityCount).length;
      this.activeCounters = Object.values(cityCount).reduce((sum, count) => sum + count, 0);
    });
  }
}
