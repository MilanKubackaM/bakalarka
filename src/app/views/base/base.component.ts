import { Component, HostListener, OnInit } from '@angular/core';
import { ToasterService, ToasterType } from 'src/app/shared/services/toaster/toaster.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit{

  constructor(
    private toasterService: ToasterService
  ){}

  ngOnInit(){
    // this.toasterService.openToaster("Halo", ToasterType.Success);
  }

}
