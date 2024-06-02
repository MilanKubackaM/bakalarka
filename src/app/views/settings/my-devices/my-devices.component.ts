import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { DataService } from 'src/app/shared/services/data/data.service';
import { DeviceData } from 'src/app/shared/models/data.model';
import { CommonModule } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmationDialogComponent } from 'src/app/utils/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-my-devices',
  standalone: true,
  templateUrl: './my-devices.component.html',
  styleUrl: './my-devices.component.css',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    CommonModule,
    MatIconModule,
    FormsModule
  ]
})
export class MyDevicesComponent {
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private modalService: BsModalService,
    private toastr: ToastrService

  ) { }

  interval: any;
  public data: DeviceData[] = [];
  public editingDevice: { [key: string]: boolean } = {};
  private originalData: { [key: string]: DeviceData } = {};

  ngOnInit() {
    setTimeout(() => {
      this.interval = setInterval(async () => {
        const uid = this.authService.getCurrentUserUID();
        if (uid) {
          this.dataService.getDataFromUser(uid).subscribe((data: DeviceData[]) => {
            this.data = data;
            this.addBatteryLife();
          });
        } else {
        }
        clearInterval(this.interval);
      }, 1000);
    }, 0);
  }

  addBatteryLife() {
    this.data.forEach((device: DeviceData) => {
      this.dataService.getBatteryLife(device.apiUrl).subscribe((batteryLife: number | null) => {
        device.battery = batteryLife !== null ? batteryLife : 0;
      });
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


  editDevice(device: DeviceData): void {
    this.originalData[device.name] = { ...device };
    this.editingDevice[device.name] = true;
  }

  async saveDevice(device: DeviceData): Promise<void> {
    const uid = this.authService.getCurrentUserUID();
    const isConnected = await this.testApiConnection(device.apiUrl);

    if (!isConnected) return;
    if (uid) {
      this.dataService.updateDevice(uid, device.name, device).then(() => {
        this.editingDevice[device.name] = false;
      }).catch(error => {
        this.toastr.error('Chyba pri aktualizovaní údajov zariadenia!', error);
      });
    }
  }

  async testApiConnection(apiUrl: String): Promise<boolean> {
    const api = "http://" + apiUrl + "/query?db=sensor_data&q=SELECT * FROM sensor_data";
    return new Promise((resolve) => {
      this.dataService.testApiConnection(api).subscribe(
        (isConnected) => {
          if (isConnected) {
            resolve(true);
          } else {
            this.toastr.error('Nepodarilo sa nadviazať spojenie, skontrolujte zadané API!', 'Chybné údaje');
            resolve(false);
          }
        },
        () => {
          this.toastr.error('Nepodarilo sa nadviazať spojenie, skontrolujte zadané API!', 'Chybné údaje');
          resolve(false);
        }
      );
    });
  }

  cancelEdit(device: DeviceData) {
    this.editingDevice[device.name] = false;
  }
}
