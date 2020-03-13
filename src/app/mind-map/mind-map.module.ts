import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MindMapRoutingModule } from './mind-map-routing.module';
import { MindMapComponent } from './mind-map.component';
import { NgxEchartsModule } from 'ngx-echarts';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { MindMapOptionsComponent } from './mind-map-options/mind-map-options.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [MindMapComponent, MindMapOptionsComponent],
  imports: [
    CommonModule,
    MindMapRoutingModule,
    NgxEchartsModule,
    MatBottomSheetModule,
    MatSidenavModule,
    MatListModule,
    SharedModule
  ],
  entryComponents:[
    MindMapOptionsComponent
  ]
})
export class MindMapModule { }
