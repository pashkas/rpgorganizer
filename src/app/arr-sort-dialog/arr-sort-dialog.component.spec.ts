import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrSortDialogComponent } from './arr-sort-dialog.component';

describe('ArrSortDialogComponent', () => {
  let component: ArrSortDialogComponent;
  let fixture: ComponentFixture<ArrSortDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrSortDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrSortDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
