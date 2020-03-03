import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaryEditParamsComponent } from './diary-edit-params.component';

describe('DiaryEditParamsComponent', () => {
  let component: DiaryEditParamsComponent;
  let fixture: ComponentFixture<DiaryEditParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiaryEditParamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiaryEditParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
