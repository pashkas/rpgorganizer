import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QwestDetailComponent } from './qwest-detail.component';

describe('QwestDetailComponent', () => {
  let component: QwestDetailComponent;
  let fixture: ComponentFixture<QwestDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QwestDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QwestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
