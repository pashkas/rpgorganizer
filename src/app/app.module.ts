import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environments/environment';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MainWindowComponent } from './main-window/main-window.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PersListComponent } from './pers-list/pers-list.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AutofocusDirective } from './autofocus.directive';
import { CharacteristicDetailsComponent } from './characteristic-details/characteristic-details.component';
import { AbilityDetailComponent } from './ability-detail/ability-detail.component';
import { TaskDetailComponent } from './task-detail/task-detail.component'

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { EnamiesComponent } from './enamies/enamies.component';

// import { AngularSvgIconModule, SvgIconRegistryService } from 'angular-svg-icon';
import { HttpClientModule } from '@angular/common/http';
import { QwestDetailComponent } from './qwest-detail/qwest-detail.component';
import { SelectOnClickDirective } from './select-on-click.directive';
// import { ImgCacheModule, ImgCacheService } from 'ng-imgcache';

import { ToastrModule } from 'ngx-toastr';
import { TurnirTableComponent } from './turnir-table/turnir-table.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SvgIconComponent } from './svg-icon/svg-icon.component';

import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material'
import { PersChangesComponent } from './pers-changes/pers-changes.component';
import { AbupcolPipe } from './abupcol.pipe';
import { CountoModule } from 'angular2-counto';
import * as Hammer from 'hammerjs';
import { PersChangesItemComponent } from './pers-changes-item/pers-changes-item.component';
import { LevelUpMsgComponent } from './level-up-msg/level-up-msg.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AddItemDialogComponent } from './add-item-dialog/add-item-dialog.component';
import { AddOrEditRevardComponent } from './add-or-edit-revard/add-or-edit-revard.component';
import { RarecolPipe } from './rarecol.pipe';
import { DiaryComponent } from './diary/diary.component';
import { DiaryShowComponent } from './diary/diary-show/diary-show.component';
import { DiaryEditParamsComponent } from './diary/diary-edit-params/diary-edit-params.component';

import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { EditDiaryParamsComponent } from './diary/edit-diary-params/edit-diary-params.component';
import {MatSliderModule} from '@angular/material/slider';
import { GestureConfig } from '@angular/material';
import { ChartsModule } from 'ng2-charts';
import { ParamsChartComponent } from './diary/params-chart/params-chart.component';

registerLocaleData(localeRu, 'ru');

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { direction: Hammer.DIRECTION_ALL },
    press: { time: 525 }
  };
}

@NgModule({
  declarations: [
    AppComponent,
    MainWindowComponent,
    LoginComponent,
    PersListComponent,
    AutofocusDirective,
    CharacteristicDetailsComponent,
    AbilityDetailComponent,
    TaskDetailComponent,
    EnamiesComponent,
    QwestDetailComponent,
    SelectOnClickDirective,
    TurnirTableComponent,
    SvgIconComponent,
    PersChangesComponent,
    AbupcolPipe,
    PersChangesItemComponent,
    LevelUpMsgComponent,
    AddItemDialogComponent,
    AddOrEditRevardComponent,
    RarecolPipe,
    DiaryComponent,
    DiaryShowComponent,
    DiaryEditParamsComponent,
    EditDiaryParamsComponent,
    ParamsChartComponent
  ],
  imports: [
    ChartsModule,
    MatSliderModule,
    CountoModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
    MatBadgeModule,
    MatChipsModule,
    MatGridListModule,
    MatTabsModule,
    MatProgressBarModule,
    FlexLayoutModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    MatRippleModule,
    MatButtonModule,
    DragDropModule,
    // ImgCacheModule,
    MDBBootstrapModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserModule,
    AppRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxMaterialTimepickerModule,
    HttpClientModule,
    ToastrModule.forRoot(
      {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        newestOnTop: false,
        disableTimeOut: true
      }
    ),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'ru' },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: GestureConfig,
    },
    { provide: LOCALE_ID, useValue: 'ru' }
  ],
  bootstrap: [AppComponent],
  entryComponents:
    [
      PersChangesComponent,
      LevelUpMsgComponent,
      AddItemDialogComponent,
      AddOrEditRevardComponent,
      EditDiaryParamsComponent,
      DiaryEditParamsComponent
    ]
})
export class AppModule {
  // constructor(imgCache: ImgCacheService) {
  //   imgCache.init({
  //     // Pass any options here...
  //   });
  // }
}
