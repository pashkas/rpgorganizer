import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar-num',
  templateUrl: './progress-bar-num.component.html',
  styleUrls: ['./progress-bar-num.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarNumComponent implements OnInit {
  @Input() text: Text;
  @Input() val: number;

  constructor() { }

  ngOnInit() {
  }

}
