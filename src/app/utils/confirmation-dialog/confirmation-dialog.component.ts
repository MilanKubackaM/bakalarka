import { Component, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent {
  confirmationResult: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public modalRef: BsModalRef) {}

  confirm(): void {
    this.modalRef.hide();
    this.confirmationResult.emit(true); 
  }

  cancel(): void {
    this.modalRef.hide();
    this.confirmationResult.emit(false); 
  }
}
