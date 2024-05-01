import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { DeviceCardComponent } from "../../device-card/device-card.component";
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
    private dataService: DataService,
    private modalService: BsModalService
  ) {}

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


}
