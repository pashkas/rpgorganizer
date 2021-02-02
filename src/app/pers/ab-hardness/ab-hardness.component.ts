import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Task } from 'src/Models/Task';

@Component({
  selector: 'app-ab-hardness',
  templateUrl: './ab-hardness.component.html',
  styleUrls: ['./ab-hardness.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AbHardnessComponent implements OnInit {
  @Input() tsk: Task;

  constructor() { }

  ngOnInit() {
  }
}
