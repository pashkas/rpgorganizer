import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbHardnessComponent } from './ab-hardness.component';

describe('AbHardnessComponent', () => {
  let component: AbHardnessComponent;
  let fixture: ComponentFixture<AbHardnessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbHardnessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbHardnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
