import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TskTimeValDialogComponent } from './tsk-time-val-dialog.component';

describe('TskTimeValDialogComponent', () => {
  let component: TskTimeValDialogComponent;
  let fixture: ComponentFixture<TskTimeValDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TskTimeValDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TskTimeValDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
