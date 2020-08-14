import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.css']
})
export class AddItemDialogComponent implements OnInit {
  breakpoint: number;
  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<AddItemDialogComponent>) { }
  isGallery = false;
  gallerryImages = [];

  ngOnInit() {
    if (this.data && this.data.isGallery) {
      this.isGallery = true;
    }
    for (let i = 1; i <= 125; i++) {
      let ss = '000' + i;
      ss = ss.substr(ss.length - 3);
      this.gallerryImages.push('assets/img/Gallery/' + ss + '.jpg');
    }
  }

  chooseImg(img) {
    this.dialogRef.close(img);
  }

  gallery() {
    this.isGallery = !this.isGallery;
  }
}
