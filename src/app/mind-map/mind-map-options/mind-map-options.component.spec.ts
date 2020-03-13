import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MindMapOptionsComponent } from './mind-map-options.component';

describe('MindMapOptionsComponent', () => {
  let component: MindMapOptionsComponent;
  let fixture: ComponentFixture<MindMapOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MindMapOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MindMapOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
