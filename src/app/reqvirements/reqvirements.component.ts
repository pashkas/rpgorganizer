import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-reqvirements',
  templateUrl: './reqvirements.component.html',
  styleUrls: ['./reqvirements.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReqvirementsComponent implements OnInit {
  @Input() isEditMode: boolean;
  @Input() reccurence: string;

  constructor() { }

  ngOnInit() {
  }

}
