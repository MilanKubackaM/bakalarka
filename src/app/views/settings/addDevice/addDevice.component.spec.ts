import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDeviceComponent } from './addDevice.component';

describe('AddDeviceComponent', () => {
  let component: AddDeviceComponent;
  let fixture: ComponentFixture<AddDeviceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDeviceComponent]
    });
    fixture = TestBed.createComponent(AddDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
