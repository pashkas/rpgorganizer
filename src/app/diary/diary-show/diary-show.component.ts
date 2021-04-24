import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Diary, DicData } from 'src/Models/Diary';
import { MatDialog } from '@angular/material';
import { EditDiaryParamsComponent } from '../edit-diary-params/edit-diary-params.component';
import { PersService } from 'src/app/pers.service';
import { DiaryEditParamsComponent } from '../diary-edit-params/diary-edit-params.component';
import { Overlay } from '@angular/cdk/overlay';
import { Label } from 'ng2-charts';
import { ChartDataSets } from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-diary-show',
  templateUrl: './diary-show.component.html',
  styleUrls: ['./diary-show.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiaryShowComponent implements OnInit {
  @Input() Diary: Diary[];
  chartData: ChartDataSets[] = [];
  chartLabels: Label[] = [];
  hiddenIndex: number = null;
  @Input() isFromMain: boolean;
  @Output() onChanged = new EventEmitter<boolean>();

  constructor(public dialog: MatDialog, private srv: PersService, private overlay: Overlay) { }

  chartClick(e: number) {
    // if (e != undefined && e != null && this.srv.pers.Diary.length > 0) {
    //   const dind = (this.srv.pers.Diary.length - 1) - e;
    //   this.editDiaryItem(this.srv.pers.Diary[dind]);
    // }
  }

  clearDiary() {
    // this.srv.clearDiary();
    // this.onChanged.emit(true);
    // this.updateChart();
  }

  editDiaryItem(d: Diary) {
    this.srv.isDialogOpen = true;
    let dialogRef = this.dialog.open(DiaryEditParamsComponent, {
      backdropClass: 'backdrop',
      panelClass: 'par-dialog',
      data: d,
      scrollStrategy: this.overlay.scrollStrategies.block()
    });

    dialogRef.afterClosed().subscribe(n => {
      this.srv.savePers(false);
      this.srv.isDialogOpen = false;
      this.onChanged.emit(true);
      this.updateChart();
    });
  }

  editParams() {
    this.srv.isDialogOpen = true;
    let dialogRef = this.dialog.open(EditDiaryParamsComponent, {
      backdropClass: 'backdrop',
      panelClass: 'par-dialog',
      scrollStrategy: this.overlay.scrollStrategies.block()
    });

    dialogRef.afterClosed().subscribe(n => {
      this.srv.isDialogOpen = false;
      this.onChanged.emit(true);
      this.updateChart();
    });
  }

  legendClick(e) {
    if (this.hiddenIndex == e) {
      this.hiddenIndex = null;
    }
    else {
      this.hiddenIndex = e;
    }

    this.updateChart();
  }

  ngOnInit() {
    this.updateChart();
  }

  updateChart() {
    // if (this.srv.pers.Diary.length == 0) {
    //   return;
    // }

    // let labels: Label[] = [];
    // let data: ChartDataSets[] = [];
    // let dict = new Map<string, DicData>();

    // this.srv.pers.Diary[0].params.forEach(p => {
    //   dict.set(p.id, new DicData(p.name));
    // });

    // this.srv.pers.Diary.forEach(d => {
    //   let dat = moment(d.date).format('DD.MM');
    //   labels.unshift(dat);
    //   d.params.forEach(p => {
    //     dict.get(p.id).data.unshift(p.val);
    //   });
    // });

    // dict.forEach(dic => {
    //   data.push({
    //     data: dic.data, label: dic.name
    //   });
    // });

    // let getHidden = (i: number): boolean => {
    //   if (this.hiddenIndex == null) {
    //     return false;
    //   }
    //   if (this.hiddenIndex != i) {
    //     return true;
    //   }
    // };

    // for (let i = 0; i < data.length; i++) {
    //   let dd = data[i];
    //   dd.hidden = getHidden(i);
    // }

    // this.chartLabels = labels;
    // this.chartData = data;
  }
}
