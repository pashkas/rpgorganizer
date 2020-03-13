import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MmoptComponent } from './mmopt.component';

describe('MmoptComponent', () => {
  let component: MmoptComponent;
  let fixture: ComponentFixture<MmoptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MmoptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MmoptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
