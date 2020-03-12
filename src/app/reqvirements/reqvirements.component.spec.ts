import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqvirementsComponent } from './reqvirements.component';

describe('ReqvirementsComponent', () => {
  let component: ReqvirementsComponent;
  let fixture: ComponentFixture<ReqvirementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqvirementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqvirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
