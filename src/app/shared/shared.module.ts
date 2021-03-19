import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiaryEditParamsComponent } from '../diary/diary-edit-params/diary-edit-params.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatListModule, MatInputModule, MatSliderModule, MatGridListModule, MatGridTile, MatSelectModule } from '@angular/material'
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from "@angular/flex-layout";
import { PersChangesComponent } from '../pers-changes/pers-changes.component';
import { PersChangesItemComponent } from '../pers-changes-item/pers-changes-item.component';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { ImageComponentComponent } from '../image-component/image-component.component';
import { NgxMasonryModule } from 'ngx-masonry';
import { TimeValPipe } from './time-val.pipe';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    DiaryEditParamsComponent,
    PersChangesComponent,
    PersChangesItemComponent,
    AddItemDialogComponent,
    TimeValPipe,
  ],
  imports: [
    NgxMaterialTimepickerModule,
    NgxMasonryModule,
    MatGridListModule,
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatListModule,
    MatInputModule,
    MatSliderModule,
    MatProgressBarModule,
    MatButtonModule,
    DragDropModule,
    FlexLayoutModule,
    MatSelectModule
  ],
  entryComponents:
    [
      DiaryEditParamsComponent,
      PersChangesComponent,
      AddItemDialogComponent,
    ],
  exports: [
    DiaryEditParamsComponent,
    PersChangesItemComponent,
    MatDialogModule,
    FormsModule,
    MatListModule,
    MatInputModule,
    MatSliderModule,
    MatProgressBarModule,
    MatButtonModule,
    DragDropModule,
    FlexLayoutModule,
    PersChangesComponent,
    AddItemDialogComponent,
    TimeValPipe,
    MatSelectModule
  ]
})
export class SharedModule { }
