import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqEditComponent } from './req-edit.component';

describe('ReqEditComponent', () => {
  let component: ReqEditComponent;
  let fixture: ComponentFixture<ReqEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
