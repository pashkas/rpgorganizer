import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiaryEditParamsComponent } from '../diary/diary-edit-params/diary-edit-params.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatListModule, MatInputModule, MatSliderModule } from '@angular/material'
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from "@angular/flex-layout";
import { PersChangesComponent } from '../pers-changes/pers-changes.component';
import { PersChangesItemComponent } from '../pers-changes-item/pers-changes-item.component';

@NgModule({
  declarations: [
    DiaryEditParamsComponent,
    PersChangesComponent,
    PersChangesItemComponent,
  ],
  imports: [
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
  ],
  entryComponents:
    [
      DiaryEditParamsComponent,
      PersChangesComponent,
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
  ]
})
export class SharedModule { }
