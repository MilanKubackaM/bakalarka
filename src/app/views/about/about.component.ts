import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data/data.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  // animations: [
  //   trigger('valueChange', [
  //     state('start', style({
  //       opacity: 0,
  //       transform: 'scale(0.5)'
  //     })),
  //     state('end', style({
  //       opacity: 1,
  //       transform: 'scale(1)'
  //     })),
  //     transition('start => end', animate('3000ms ease-out')) // 3 sekundy
  //   ])
  // ]
})
export class AboutComponent implements OnInit {
  activeCounters: number;
  activeCities: number;


  constructor(
    private dataService: DataService,
    // private translate: TranslateService
  ){
    this.activeCounters = 5;
    this.activeCities = 2;
  };

  ngOnInit() {
    // Vyvolanie animácie po načítaní stránky
    // setTimeout(() => {
    //   this.animationState = 'end';
    // }, 10000);
    this.setCounters();
  }

  // startAnimation() {
  //   this.animationState = 'end';
  // }

  setCounters(){
    this.dataService.getGlobalData().then((data) => {
      this.activeCities = data.cities;
      this.activeCounters = data.devices;
    }).catch((error) => {
      console.error('Chyba pri získavaní globálnych údajov:', error);
    });
    
  }
  
}
