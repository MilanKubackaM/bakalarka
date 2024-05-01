import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDevicesComponent } from './my-devices.component';

describe('MyDevicesComponent', () => {
  let component: MyDevicesComponent;
  let fixture: ComponentFixture<MyDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDevicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
