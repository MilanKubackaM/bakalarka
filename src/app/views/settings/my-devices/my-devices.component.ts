import { Component, ComponentFactoryResolver, NgZone, ViewChild, ViewContainerRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { DeviceCardComponent } from "../../device-card/device-card.component";
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { DataService } from 'src/app/shared/services/data/data.service';
import { DeviceData } from 'src/app/shared/models/data.model';
import { CommonModule } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmationDialogComponent } from 'src/app/utils/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-my-devices',
  standalone: true,
  templateUrl: './my-devices.component.html',
  styleUrl: './my-devices.component.css',
  imports: [
    MatCardModule, 
    MatButtonModule, 
    MatDividerModule, 
    DeviceCardComponent,
    CommonModule
  ]
})
export class MyDevicesComponent {
  constructor(
    private authService: AuthService,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private dataService: DataService,
    // private toaster: ToasterService,
    private toastr: ToastrService,
    private resolver: ComponentFactoryResolver,
    private modalService: BsModalService
  ) {
   }

  interval: any;
  public data: DeviceData[] = [];


  ngOnInit() {
    setTimeout(() => {
      this.interval = setInterval(async () => {
        const uid = this.authService.getCurrentUserUID();
        if (uid) {
          this.dataService.getDataFromUser(uid).subscribe((data: DeviceData[]) => {
            this.data = data;
            this.showData();
          });
        } else {
        }
        clearInterval(this.interval);
      }, 1000);
    }, 0);
  }

  showData() {
    const cardContainer = document.getElementById('card-container'); 
    this.data.forEach((data: DeviceData) => {
      const deviceCard = document.createElement('app-device-card');

      deviceCard.setAttribute('name', data.name); 
      deviceCard.setAttribute('address', data.location);
      deviceCard.setAttribute('apiUrl', data.apiUrl);

      cardContainer?.appendChild(deviceCard);
    });
  }

  deleteDevice(name: string): void {
    const modalRef = this.modalService.show(ConfirmationDialogComponent, {
      class: 'modal-dialog-centered'
    });

    modalRef.content?.confirmationResult.subscribe((result: boolean) => {
      if (result) {
        this.dataService.deleteDevice(this.authService.getCurrentUserUID(), name)      
    } else {
      }
    });
  }

  cities = ['Bratislava', 'Senec', 'Prievidza'];
  i = 0;


  editDevice(name: String){
   
  }



}

// addToGlobalData(city: string): Promise<void> {
//   const globalDataDocRef = this.firestore.doc('globalData/globalData');
//   const cityDocRef = globalDataDocRef.collection('cities').doc(city);

//   return this.firestore.firestore.runTransaction(async (transaction) => {
//     const globalDataSnapshot = await transaction.get(globalDataDocRef.ref);

//     if (globalDataSnapshot.exists) {
//       // Increment city count and device count
//       transaction.update(globalDataDocRef.ref, {
//         numberOfCities: (globalDataSnapshot.data() as any).numberOfCities + 1,
//         numberOfDevices: (globalDataSnapshot.data() as any).numberOfDevices + 1
//       });

//       // Check if city exists
//       const cityDataSnapshot = await transaction.get(cityDocRef.ref);
//       if (cityDataSnapshot.exists) {
//         transaction.update(cityDocRef.ref, {
//           numberOfDevices: (cityDataSnapshot.data() as any).numberOfDevices + 1
//         });
//       } else {
//         transaction.set(cityDocRef.ref, {
//           numberOfDevices: 1
//         });
//       }
//     } else {
//       // Create new globalData entry
//       transaction.set(globalDataDocRef.ref, {
//         cities: {
//           [city]: {
//             numberOfDevices: 1
//           }
//         },
//         numberOfCities: 1,
//         numberOfDevices: 1
//       });
//     }
//   })
//   .then(() => {
//     this.toastr.success('Údaje boli úspešne aktualizované!', 'Úspech');
//   })
//   .catch((error) => {
//     this.toastr.error('Chyba pri aktualizovaní údajov!', error);
//   });
// }

