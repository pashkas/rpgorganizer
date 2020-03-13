import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-mmopt',
  templateUrl: './mmopt.component.html',
  styleUrls: ['./mmopt.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MmoptComponent implements OnInit {

  @Input() x=0;
  @Input() y=0;
  
  constructor() { }

  ngOnInit() {
  }

}
