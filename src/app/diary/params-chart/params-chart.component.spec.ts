import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamsChartComponent } from './params-chart.component';

describe('ParamsChartComponent', () => {
  let component: ParamsChartComponent;
  let fixture: ComponentFixture<ParamsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
