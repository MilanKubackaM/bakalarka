import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';

@Component({
  standalone: true,
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.css'],
  imports: [
    MatDialogContent,
    MatLabel,
    MatFormField,
    MatDialogActions,
    ReactiveFormsModule
  ]
})
export class EditDeviceComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: [data.name, Validators.required],
      apiUrl: [data.apiUrl, Validators.required],
      location: this.fb.group({
        city: [data.location.city, Validators.required],
        route: [data.location.route, Validators.required],
        streetNumber: [data.location.streetNumber, Validators.required]
      })
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
