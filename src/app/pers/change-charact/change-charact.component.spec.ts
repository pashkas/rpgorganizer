import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeCharactComponent } from './change-charact.component';

describe('ChangeCharactComponent', () => {
  let component: ChangeCharactComponent;
  let fixture: ComponentFixture<ChangeCharactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeCharactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeCharactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
