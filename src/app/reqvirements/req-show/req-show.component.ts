import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChanges } from '@angular/core';
import { Reqvirement } from 'src/Models/Task';

@Component({
  selector: 'app-req-show',
  templateUrl: './req-show.component.html',
  styleUrls: ['./req-show.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReqShowComponent implements OnInit {
  @Input() reqvirements: Reqvirement[];
  notDoneReqs: Reqvirement[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.reqvirements) {
      this.notDoneReqs = changes.reqvirements.currentValue.filter(n=>!n.isDone);
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
