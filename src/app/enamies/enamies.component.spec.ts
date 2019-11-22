import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnamiesComponent } from './enamies.component';

describe('EnamiesComponent', () => {
  let component: EnamiesComponent;
  let fixture: ComponentFixture<EnamiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnamiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnamiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
