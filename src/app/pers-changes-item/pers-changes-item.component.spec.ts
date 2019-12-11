import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersChangesItemComponent } from './pers-changes-item.component';

describe('PersChangesItemComponent', () => {
  let component: PersChangesItemComponent;
  let fixture: ComponentFixture<PersChangesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersChangesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersChangesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
