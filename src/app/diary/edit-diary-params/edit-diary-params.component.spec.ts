import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDiaryParamsComponent } from './edit-diary-params.component';

describe('EditDiaryParamsComponent', () => {
  let component: EditDiaryParamsComponent;
  let fixture: ComponentFixture<EditDiaryParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDiaryParamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDiaryParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
