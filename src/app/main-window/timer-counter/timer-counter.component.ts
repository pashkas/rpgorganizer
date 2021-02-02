import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { PersService } from 'src/app/pers.service';
import { Task } from 'src/Models/Task';
import { interval, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-timer-counter',
  templateUrl: './timer-counter.component.html',
  styleUrls: ['./timer-counter.component.css']
})
export class TimerCounterComponent implements OnInit {
  @Input() tsk: Task;
  isTimerStart: boolean;
  timerSubscr: any;
  starttime: Date;
  timeSteal: number = 0;
  persTask: Task;

  constructor(private srv: PersService) { }

  ngOnDestroy(): void {
    this.timerStop(false);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.timerStop(false);
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

  }

  counter() {
    this.tsk.counterValue++;
    for (const ch of this.srv.pers.characteristics) {
      for (const ab of ch.abilities) {
        for (const t of ab.tasks) {
          if (t.id == this.tsk.id || t.id == this.tsk.parrentTask) {
            this.persTask = t;
            this.persTask.counterValue = this.tsk.counterValue;
            this.srv.savePers(false);
            break;
          }
        }
      }
    }
  }

  timerRx = interval(5000);

  timer() {
    for (const ch of this.srv.pers.characteristics) {
      for (const ab of ch.abilities) {
        for (const t of ab.tasks) {
          if (t.id == this.tsk.id || t.id == this.tsk.parrentTask) {
            this.persTask = t;
            break;
          }
        }
      }
    };

    this.isTimerStart = !this.isTimerStart;

    if (this.isTimerStart) {
      this.starttime = new Date();

      this.timerSubscr = this.timerRx.subscribe(val => {
        let dif = (new Date().getTime() - new Date(this.starttime).getTime());

        this.timeSteal = dif;
      });
    }
    else {
      this.timerStop(true);
    }
  }

  private timerStop(noChek) {
    if (this.isTimerStart || noChek) {
      if (this.timerSubscr) {
        this.timerSubscr.unsubscribe();
      }
      this.persTask.timerValue = this.tsk.timerValue + this.timeSteal;
      this.timeSteal = 0;
      this.isTimerStart=false;
      this.timerSubscr=null;
      this.srv.savePers(false);
    }
  }

  ngOnInit() {
  }
}
