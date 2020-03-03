import { Component, OnInit, ChangeDetectionStrategy, Input, Inject } from '@angular/core';
import { Diary } from 'src/Models/Diary';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-diary-edit-params',
  templateUrl: './diary-edit-params.component.html',
  styleUrls: ['./diary-edit-params.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiaryEditParamsComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public d: Diary) {
   }

  ngOnInit() {
  }
}
