import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqShowComponent } from './req-show.component';

describe('ReqShowComponent', () => {
  let component: ReqShowComponent;
  let fixture: ComponentFixture<ReqShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
