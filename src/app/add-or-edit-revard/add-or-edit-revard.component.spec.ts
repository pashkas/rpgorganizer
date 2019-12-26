import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditRevardComponent } from './add-or-edit-revard.component';

describe('AddOrEditRevardComponent', () => {
  let component: AddOrEditRevardComponent;
  let fixture: ComponentFixture<AddOrEditRevardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrEditRevardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrEditRevardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
