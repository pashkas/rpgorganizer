import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersRoutingModule } from './pers-routing.module';
import { PersListComponent } from '../pers-list/pers-list.component';
import { ParamsChartComponent } from '../diary/params-chart/params-chart.component';
import { ChartsModule } from 'ng2-charts';
import { DiaryComponent } from '../diary/diary.component';
import { DiaryShowComponent } from '../diary/diary-show/diary-show.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RarecolPipe } from '../rarecol.pipe';
import { MatCardModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { CharacteristicDetailsComponent } from '../characteristic-details/characteristic-details.component';
import { AbilityDetailComponent } from '../ability-detail/ability-detail.component';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import { QwestDetailComponent } from '../qwest-detail/qwest-detail.component';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { AddOrEditRevardComponent } from '../add-or-edit-revard/add-or-edit-revard.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { SharedModule } from '../shared/shared.module';
import { AbupcolPipe } from '../abupcol.pipe';
import { EditDiaryParamsComponent } from '../diary/edit-diary-params/edit-diary-params.component';
import { EnamiesComponent } from '../enamies/enamies.component';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@NgModule({
  declarations: [
    DiaryShowComponent,
    PersListComponent,
    RarecolPipe,
    ParamsChartComponent,
    DiaryComponent,
    CharacteristicDetailsComponent,
    AbilityDetailComponent,
    TaskDetailComponent,
    QwestDetailComponent,
    AddItemDialogComponent,
    AddOrEditRevardComponent,
    AbupcolPipe,
    EditDiaryParamsComponent,
    EnamiesComponent,
    SvgIconComponent
  ],
  imports: [
    SharedModule,
    MatSelectModule,
    MatCardModule,
    CommonModule,
    PersRoutingModule,
    ChartsModule,
    MatTabsModule,
    FormsModule,
    MatProgressBarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  entryComponents:
    [
      AddItemDialogComponent,
      AddOrEditRevardComponent,
      EditDiaryParamsComponent
    ],
  providers: [{ provide: OWL_DATE_TIME_LOCALE, useValue: 'ru' },]
})
export class PersModule { }