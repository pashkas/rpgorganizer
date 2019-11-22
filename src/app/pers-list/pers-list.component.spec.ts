import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersListComponent } from './pers-list.component';

describe('PersListComponent', () => {
  let component: PersListComponent;
  let fixture: ComponentFixture<PersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
