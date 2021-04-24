import { Component, OnInit } from '@angular/core';
import { PersService } from 'src/app/pers.service';
import { DiaryParam } from 'src/Models/Diary';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddItemDialogComponent } from 'src/app/add-item-dialog/add-item-dialog.component';
import { taskState } from 'src/Models/Task';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  templateUrl: './edit-diary-params.component.html',
  styleUrls: ['./edit-diary-params.component.css']
})
export class EditDiaryParamsComponent implements OnInit {
  DiaryParams: DiaryParam[] = [];

  constructor(private srv: PersService, private dialog: MatDialog, public dialogRef: MatDialogRef<EditDiaryParamsComponent>) { }

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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.DiaryParams, event.previousIndex, event.currentIndex);
  }

  ngOnInit() {
    // if (this.srv.pers.Diary.length > 0) {
    //   this.DiaryParams = [...this.srv.pers.Diary[0].params];
    // }
  }

  save() {
    // // Order
    // for (let i = 0; i < this.DiaryParams.length; i++) {
    //   const el = this.DiaryParams[i];
    //   el.order = i;
    // }

    // // Удаление
    // this.srv.pers.Diary.forEach(d => {
    //   d.params = d.params.filter(n => this.DiaryParams.filter(q => q.id == n.id).length > 0);
    // });

    // // Добавление, редактирование
    // for (let i = 0; i < this.DiaryParams.length; i++) {
    //   const par = this.DiaryParams[i];

    //   for (let j = 0; j < this.srv.pers.Diary.length; j++) {
    //     const d = this.srv.pers.Diary[j];
    //     let p = d.params.filter(z => z.id == par.id);
    //     if (p.length == 0) {
    //       let dp = new DiaryParam();
    //       dp.name = par.name;
    //       dp.id = par.id;
    //       dp.order = par.order;
    //       d.params.push(dp);
    //     }
    //     else {
    //       p[0].name = par.name;
    //       p[0].order = par.order;
    //     }

    //     d.params = d.params.sort((a,b)=>a.order-b.order);
    //   }
    // }



    // this.srv.savePers(false);
    // this.dialogRef.close();
  }
}
