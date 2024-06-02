import { Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { DataService } from 'src/app/shared/services/data/data.service';
import { ToastrService } from 'ngx-toastr';
import { AddressData } from 'src/app/shared/models/data.model';

interface Option {
  name: string;
}

@Component({
  selector: 'app-addDevice',
  templateUrl: './addDevice.component.html',
  styleUrls: ['./addDevice.component.css']
})
export class AddDeviceComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private ngZone: NgZone,
    private dataService: DataService,
    private toastr: ToastrService
  ) { }

  @Input() location!: AddressData;
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('inputField') inputField!: ElementRef;
  @ViewChild('myControl') myControlInput!: ElementRef<HTMLInputElement>;

  address: string = '';
  autocomplete: google.maps.places.Autocomplete | undefined;
  @ViewChild('auto') matAutocomplete: MatAutocomplete | undefined;
  myControl = new FormControl();

  showMap: boolean = false;
  interval: any;
  settingsForm!: FormGroup;
  apiUrl: string = '';
  counterName: string = '';
  public savingData: boolean = false;

  loadingApiTest: boolean = false;
  apiTestPassed: boolean = false;
  @ViewChild('closebutton') closeButton: any;

  ngOnInit() {

    this.settingsForm = new FormGroup({
      counterName: new FormControl('', [Validators.required]), 
      apiUrl: new FormControl('', [Validators.required]), 
      location: new FormControl('', [Validators.required]) 
    });
  }

  toggleMap() {
    this.showMap = !this.showMap;
  }

  onLocationChange(event: any) {
    const formattedAddress = `${event.route} ${event.streetNumber}, ${event.city}`;
    this.settingsForm.get('location')?.setValue(formattedAddress);
    this.location = event;
  }

  displayFn(option: Option): string {
    return option ? option.name : '';
  }

  ngOnDestroy() {
    if (this.autocomplete) {
      google.maps.event.clearInstanceListeners(this.autocomplete);
    }
  }

  logout() {
    this.authService.signOut();
    this.closebutton.nativeElement.click();
  }


  onSubmit() {
    this.savingData = true;
    if (this.settingsForm.valid) { 
      const apiUrl = this.settingsForm.get('apiUrl')?.value;
      const counterName = this.settingsForm.get('counterName')?.value;
      const currentUser = this.authService.getCurrentUser();
      const uid = currentUser?.uid; 

      if (uid) {
        setTimeout(() => {
          this.interval = setInterval(async () => {
            const dataSettled = this.dataService.setDataForUser(uid, apiUrl, counterName, this.location);
            if(await dataSettled == ''){
              this.clearInputs();
              this.closeButton.nativeElement.click();
            };
            this.savingData = false;
            clearInterval(this.interval);

          }, 2000);
        }, 0);
      } 
    }
  }

  clearInputs(){
    this.apiTestPassed = false;
    this.settingsForm.reset();
  }


  testApiConnection() {
    this.apiTestPassed = false;
    this.loadingApiTest = true;
    const api = "http://" + this.settingsForm.get('apiUrl')?.value + "/query?db=sensor_data&q=SELECT * FROM sensor_data";
    this.dataService.testApiConnection(api).subscribe(
      (isConnected) => {
        setTimeout(() => {
          this.interval = setInterval(() => {
            if (isConnected) {
              this.toastr.success('Pripojenie k API bolo úspešné!', 'Pripojene'); 
              this.apiTestPassed = true;
            } else {
              this.toastr.error('Nepodarilo sa nadviazať spojenie, skontrolujte zadané API!', 'Chybné údaje'); 
            }
            this.loadingApiTest = false;
            clearInterval(this.interval);

          }, 2000);
        }, 0);

      }
    );
  }

  clickCloseButton() {
    if (this.closeButton) {
      this.closeButton.nativeElement.click();
    }
  }
}
