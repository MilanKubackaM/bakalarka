import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverviewMapComponent } from './overviewMap.component';

describe('OverviewMapComponent', () => {
  let component: OverviewMapComponent;
  let fixture: ComponentFixture<OverviewMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewMapComponent]
    });
    fixture = TestBed.createComponent(OverviewMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
