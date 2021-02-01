import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PersService } from '../pers.service';
import { MatDialog } from '@angular/material';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-image-component',
  templateUrl: './image-component.component.html',
  styleUrls: ['./image-component.component.css']
})
export class ImageComponentComponent implements OnInit {
  @Input() data: any;
  @Output() dataChange = new EventEmitter<any>();
  @Input() isCanEdit;
  @Input() isPers:boolean=false;

  constructor(private srv: PersService, public dialog: MatDialog, private overlay: Overlay) { }

  ngOnInit() {
  }

  setImg() {
    if (!this.isCanEdit) {
      return;
    }

    let wasOpen = this.srv.isDialogOpen;
    if (!wasOpen) {
      this.srv.isDialogOpen = true;
    }
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      panelClass: 'my-big',
      data: { header: 'Выберите изображение', text: '', isGallery:true, isPers:  this.isPers},
      backdropClass: 'backdrop',
      maxWidth: undefined,
      maxHeight: undefined,
      scrollStrategy: this.overlay.scrollStrategies.block()
    });

    dialogRef.afterClosed()
      .subscribe(name => {
        if (name) {
          this.dataChange.emit(name);
        }

        if (!wasOpen) {
          this.srv.isDialogOpen = false;
        }
      });
  }
}
