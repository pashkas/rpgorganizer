import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarNumComponent } from './progress-bar-num.component';

describe('ProgressBarNumComponent', () => {
  let component: ProgressBarNumComponent;
  let fixture: ComponentFixture<ProgressBarNumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressBarNumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarNumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
