import { Component, OnInit } from '@angular/core';
import { PersService } from 'src/app/pers.service';
import { DiaryParam } from 'src/Models/Diary';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddItemDialogComponent } from 'src/app/add-item-dialog/add-item-dialog.component';
import { taskState } from 'src/Models/Task';

@Component({
  templateUrl: './edit-diary-params.component.html',
  styleUrls: ['./edit-diary-params.component.css']
})
export class EditDiaryParamsComponent implements OnInit {
  DiaryParams: DiaryParam[] = [];
  constructor(private srv: PersService, private dialog: MatDialog, public dialogRef: MatDialogRef<EditDiaryParamsComponent>) { }

  ngOnInit() {
    if (this.srv.pers.Diary.length > 0) {
      this.DiaryParams = [...this.srv.pers.Diary[0].params];
    }
  }

  addOrEditParam(par) {
    let isEdit;
    this.srv.isDialogOpen = true;

    if (par) {
      isEdit = true;
    } else {
      isEdit = false;
    }

    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      panelClass: 'my-dialog',
      data: { header: 'Настройка параметра', text: isEdit ? par.name : '' },
      backdropClass: 'backdrop'
    });

    dialogRef.afterClosed()
      .subscribe(stt => {
        if (stt) {
          if (!isEdit) {
            let p = new DiaryParam();
            p.name = stt;
            this.DiaryParams.unshift(p);
          } else {
            par.name = stt;
          }
        }
        this.srv.isDialogOpen = false;
      });
  }

  delParam(par) {
    this.DiaryParams = this.DiaryParams.filter(n => n.id != par.id);
  }

  save() {
    // Удаление
    this.srv.pers.Diary.forEach(d => {
      d.params = d.params.filter(n => this.DiaryParams.filter(q => q.id == n.id).length > 0);
    });

    // Добавление, редактирование
    for (let index = 0; index < this.DiaryParams.length; index++) {
      const par = this.DiaryParams[index];

      for (let index = 0; index < this.srv.pers.Diary.length; index++) {
        const d = this.srv.pers.Diary[index];
        let p = d.params.filter(z => z.id == par.id);
        if (p.length == 0) {
          let dp = new DiaryParam();
          dp.name = par.name;
          dp.id = par.id;
          d.params.push(dp);
        }
        else {
          if (p[0].name != par.name) {
            p[0].name = par.name;
          }
        }
      }
    }

    this.srv.savePers(false);
    this.dialogRef.close();
  }
}
