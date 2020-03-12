import { Component, OnInit, ChangeDetectionStrategy, Input, NgZone, Output, EventEmitter } from '@angular/core';
import { Reqvirement } from 'src/Models/Task';
import { PersService } from 'src/app/pers.service';
import { MatDialog } from '@angular/material';
import { ReqAddComponent } from 'src/app/pers/req-add/req-add.component';

@Component({
  selector: 'app-req-edit',
  templateUrl: './req-edit.component.html',
  styleUrls: ['./req-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReqEditComponent implements OnInit {
  @Input() reqvirements: Reqvirement[];
  @Output() reqvirementsChange = new EventEmitter<Reqvirement[]>();

  constructor(public dialog: MatDialog, private srv: PersService) { }

  ngOnInit() {
  }

  addReq() {
    this.srv.isDialogOpen = true;
    let dialogRef = this.dialog.open(ReqAddComponent, {
      backdropClass: 'backdrop',
      panelClass: 'par-dialog',
    });

    dialogRef.afterClosed().subscribe(n => {
      if (n && n.elId && n.elVal) {
        let req = new Reqvirement();
        req.elName = n.elName;
        req.elId = n.elId;
        req.elVal = n.elVal;
        this.reqvirementsChange.emit([...this.reqvirements, req]);
      }
      this.srv.isDialogOpen = false;
    });
  }

  delReq(id) {
    this.reqvirementsChange.emit(this.reqvirements.filter(n => n.id != id));
  }
}
