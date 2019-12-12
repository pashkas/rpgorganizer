import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelUpMsgComponent } from './level-up-msg.component';

describe('LevelUpMsgComponent', () => {
  let component: LevelUpMsgComponent;
  let fixture: ComponentFixture<LevelUpMsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelUpMsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelUpMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
