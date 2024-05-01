import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonGraphComponent } from './comparison-graph.component';

describe('ComparisonGraphComponent', () => {
  let component: ComparisonGraphComponent;
  let fixture: ComponentFixture<ComparisonGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComparisonGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
