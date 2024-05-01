import { Component, ElementRef, OnInit } from '@angular/core';
import { ToasterService, ToasterType } from 'src/app/shared/services/toaster/toaster.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent implements OnInit {

  public message: string = '';
  public type!: ToasterType | null;
  public myToast: any;  

  constructor(
    private toasterService: ToasterService, 
    private elementRef: ElementRef
    ) {}

  ngOnInit(): void {

    this.toasterService.message$.subscribe(message => {
      this.message = message;
    });

    this.toasterService.type$.subscribe(type => {
      this.type = type;
      if (this.message && this.type) {
        this.openToaster();
      }
    });

    this.myToast = new bootstrap.Toast(this.elementRef.nativeElement.querySelector('#myToaster'));
    this.myToast._element.addEventListener('hidden.bs.toast', () => {
      this.message = '';
      this.type = null;
    });
    
  }

  public openToaster() {
    this.myToast.show();
  }

  public getToasterClass(): string | null{
    if(this.type){
      return `toast align-items-center text-white border-0 ${this.type}`;
    }
    return null;
  }

}
