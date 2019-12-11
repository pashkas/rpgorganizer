import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ChangesModel } from 'src/Models/ChangesModel';
import { AnimationBuilder, style, animate } from '@angular/animations';

@Component({
  selector: 'app-pers-changes-item',
  templateUrl: './pers-changes-item.component.html',
  styleUrls: ['./pers-changes-item.component.css']
})
export class PersChangesItemComponent implements OnInit {

  @Input() item: ChangesModel;

  @ViewChild('progress', {static: false}) progress: ElementRef;

  constructor(public builder: AnimationBuilder) { }

  ngOnInit() {
  
  }

  ngAfterViewInit(): void {
    this.setpercentage();
  }

  setpercentage() {
    let factory = this.builder.build([
      style({ width: this.item.valFrom + '%' }),
      animate('2000ms', style({ width: this.item.valTo + '%' }))
    ]);

    let player = factory.create(this.progress.nativeElement, {})

    player.play();
  }

}
