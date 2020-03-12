import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqAddComponent } from './req-add.component';

describe('ReqAddComponent', () => {
  let component: ReqAddComponent;
  let fixture: ComponentFixture<ReqAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
