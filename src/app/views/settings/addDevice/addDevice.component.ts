import { Component, ElementRef, Input, NgZone, OnInit, SimpleChanges, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/services/data/data.service';
import { ToasterService, ToasterType } from 'src/app/shared/services/toaster/toaster.service';
import { ToastrService } from 'ngx-toastr';
import { AddressData } from 'src/app/shared/models/data.model';



interface Option {
  name: string;
  // Other properties as needed
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
    private dialog: MatDialog,
    private dataService: DataService,
    // private toaster: ToasterService,
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
  filteredOptions!: Observable<Option[]>;
  options: Option[] = [
    { name: 'Option 1' },
    { name: 'Option 2' },
    { name: 'Option 3' }
  ];
  showMap: boolean = false;
  interval: any;
  settingsForm!: FormGroup;
  apiUrl: string = '';
  counterName: string = '';
  // location: string = '';

  ngOnInit() {
    this.filteredOptions = of([]);

    this.settingsForm = new FormGroup({
      counterName: new FormControl('', [Validators.required]), // Add validation for counterName
      apiUrl: new FormControl('', [Validators.required]), // Add validation for apiUrl
      location: new FormControl('', [Validators.required]) // Add validation for location
    });
  }




  ngAfterViewInit() {
    this.initializeAutocomplete();
    this.filteredOptions = of(this.options);
  }

  toggleMap() {
    this.showMap = !this.showMap;
  }

  onLocationChange(event: any) {
    this.location = event;
  }



  initializeAutocomplete() {

    this.autocomplete = new google.maps.places.Autocomplete(
      this.inputField.nativeElement
    );

    this.autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {

        const place = this.autocomplete?.getPlace();

        const result: any = {
          address: this.inputField.nativeElement.value,
          name: place?.name,
          location: place?.geometry?.location,
          iconUrl: place?.icon,
        };
      });
    });
  }


  filterOptions(value: string): Observable<Option[]> {
    const filterValue = value.toLowerCase();
    const filtered = this.options.filter(option => option.name.toLowerCase().includes(filterValue));
    return of(filtered);
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

  public savingData: boolean = false;

  onSubmit() {
    this.savingData = true;
    if (this.settingsForm.valid) { // Check if the form is valid before submitting
      const apiUrl = this.settingsForm.get('apiUrl')?.value;
      const counterName = this.settingsForm.get('counterName')?.value;
      // const location: AddressData = this.location;

      const currentUser = this.authService.getCurrentUser();
      const uid = currentUser?.uid; // Use optional chaining


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

  loadingApiTest: boolean = false;
  apiTestPassed: boolean = false;
  @ViewChild('closebutton') closeButton: any;

  testApiConnection() {
    this.apiTestPassed = false;
    this.loadingApiTest = true;
    const api = "http://" + this.settingsForm.get('apiUrl')?.value + "/query?db=sensor_data&q=SELECT * FROM sensor_data";
    this.dataService.testApiConnection(api).subscribe(
      (isConnected) => {
        setTimeout(() => {
          this.interval = setInterval(() => {
            if (isConnected) {
              this.toastr.success('Pripojenie k API bolo úspešné!', 'Pripojene'); // Zobraziť toaster s úspešnou správou
              this.apiTestPassed = true;
            } else {
              this.toastr.error('Nepodarilo sa nadviazat spojenie, skontrolujte zadane API!', 'Chybne udaje'); // Zobraziť toaster s chybovou správou
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

  // checkIfTestedApi(){
  //   if(!this.apiTestPassed){
  //     this.toastr.warning('Pred pridanim zariadenia je potrebne otestovat API', 'Test API'); // Zobraziť toaster s chybovou správou
  //   }
  // }
}

