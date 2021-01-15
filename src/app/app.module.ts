import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { MainWindowComponent } from './main-window/main-window.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutofocusDirective } from './autofocus.directive';
import { HttpClientModule } from '@angular/common/http';
import { SelectOnClickDirective } from './select-on-click.directive';
import { LevelUpMsgComponent } from './level-up-msg/level-up-msg.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { GestureConfig, MatProgressSpinnerModule, MatGridListModule, MatGridTile } from '@angular/material';
import { SharedModule } from './shared/shared.module';
import { TurnirTableComponent } from './turnir-table/turnir-table.component';
import { ArrSortDialogComponent } from './arr-sort-dialog/arr-sort-dialog.component';
import { ProgressBarNumComponent } from './shared/progress-bar-num/progress-bar-num.component';
import { TskTimeValDialogComponent } from './tsk-time-val-dialog/tsk-time-val-dialog.component';
import { ImageComponentComponent } from './image-component/image-component.component';
import { RestComponent } from './rest/rest.component';
import { RouteReuseStrategy } from '@angular/router';
import { RouteReuseService } from './route-reuse.service';
import {MatDividerModule} from '@angular/material/divider';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

registerLocaleData(localeRu, 'ru');

@NgModule({
  declarations: [
    AppComponent,
    MainWindowComponent,
    LoginComponent,
    AutofocusDirective,
    SelectOnClickDirective,
    LevelUpMsgComponent,
    TurnirTableComponent,
    ArrSortDialogComponent,
    ProgressBarNumComponent,
    TskTimeValDialogComponent,
    RestComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    MatDividerModule,
    MatProgressSpinnerModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: GestureConfig,
    },
    { provide: LOCALE_ID, useValue: 'ru' },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReuseService
    }
  ],
  bootstrap: [AppComponent],
  entryComponents:
    [
      LevelUpMsgComponent,
      ArrSortDialogComponent,
      TskTimeValDialogComponent,
      ConfirmationDialogComponent
    ]
})
export class AppModule {
  // constructor(imgCache: ImgCacheService) {
  //   imgCache.init({
  //     // Pass any options here...
  //   });
  // }
}
