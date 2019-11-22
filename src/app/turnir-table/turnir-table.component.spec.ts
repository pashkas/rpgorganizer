import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnirTableComponent } from './turnir-table.component';

describe('TurnirTableComponent', () => {
  let component: TurnirTableComponent;
  let fixture: ComponentFixture<TurnirTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnirTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnirTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
