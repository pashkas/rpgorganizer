import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersChangesComponent } from './pers-changes.component';

describe('PersChangesComponent', () => {
  let component: PersChangesComponent;
  let fixture: ComponentFixture<PersChangesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersChangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
