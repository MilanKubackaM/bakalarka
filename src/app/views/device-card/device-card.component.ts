import { Component, Input } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-device-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: './device-card.component.html',
  styleUrl: './device-card.component.css'
})
export class DeviceCardComponent {
  @Input() name: string = '';
  @Input() address: string = '';
  @Input() api: string = '';
}
