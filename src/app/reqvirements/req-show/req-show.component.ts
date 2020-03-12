import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Reqvirement } from 'src/Models/Task';

@Component({
  selector: 'app-req-show',
  templateUrl: './req-show.component.html',
  styleUrls: ['./req-show.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReqShowComponent implements OnInit {
  @Input() reqvirements: Reqvirement[];
  constructor() { }

  ngOnInit() {
  }

}
