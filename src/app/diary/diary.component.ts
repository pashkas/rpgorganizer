import { Component, OnInit, Input } from '@angular/core';
import { PersService } from '../pers.service';
import { Diary } from 'src/Models/Diary';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css']
})
export class DiaryComponent implements OnInit {

  @Input() isEditMode: boolean;
  @Input() isFromMain:boolean;
  Diary: Diary[] = [];

  constructor(private srv: PersService) { }

  ngOnInit() {
    this.Diary = this.srv.pers.Diary;
  }

  onDiaryChanged(e){
    this.Diary = this.srv.pers.Diary;
  }

}
