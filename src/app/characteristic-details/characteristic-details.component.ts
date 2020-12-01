import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersService } from '../pers.service';
import { Pers } from 'src/Models/Pers';
import { Characteristic } from 'src/Models/Characteristic';
import { Rangse } from 'src/Models/Rangse';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Ability } from 'src/Models/Ability';
import { MatDialog } from '@angular/material';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';

@Component({
  selector: 'app-characteristic-details',
  templateUrl: './characteristic-details.component.html',
  styleUrls: ['./characteristic-details.component.css']
})
export class CharacteristicDetailsComponent implements OnInit {
  private unsubscribe$ = new Subject();

  charact: Characteristic;
  isEditMode: boolean = false;

  rangse: Rangse[];

  //  = Characteristic.rangse;
  constructor(private location: Location, private route: ActivatedRoute, public srv: PersService, private router: Router, public dialog: MatDialog) { }

  /**
   * Добавление навыка.
   */
  addAbil() {
    this.srv.isDialogOpen = true;
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      panelClass: 'my-dialog',
      data: { header: 'Добавить навык', text: '' },
      backdropClass: 'backdrop'
    });

    dialogRef.afterClosed()
      .subscribe(name => {
        if (name) {
          this.srv.addAbil(this.charact.id, name);
        }
        this.srv.isDialogOpen = false;
      });
  }

  /**
   * Удаление навыка.
   * @param id Идентификатор.
   */
  delAbil(id: string) {
    this.srv.delAbil(id);
  }

  goBack() {
    if (this.isEditMode) {
      this.isEditMode = false;
    }
    else{
      this.location.back();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    if (!this.srv.pers) {
      this.router.navigate(['/main']);
    }
    
    this.rangse = [];
    for (let index = 0; index <= this.srv.pers.maxAttrLevel; index++) {
      if (this.srv.pers.isTES && index == 0) {
        continue;
      }
      let rng = new Rangse();
      rng.val = index;
      rng.img = '';
      rng.name = '' + index;
      this.rangse.push(rng);
    }


    if (!this.srv.pers) {
      this.router.navigate(['/main']);
    }

    const id = this.route.snapshot.paramMap.get('id');
    this.charact = this.srv.pers.characteristics.filter(n => { return n.id === id })[0];

  }

  /**
   * Сохранить данные.
   */
  saveData() {
    if (this.isEditMode) {
      this.srv.savePers(false);
      this.isEditMode = false;
    }
    else {
      this.isEditMode = true;
    }
  }

  showAbility(ab: Ability) {
    if (Pers.GameSettings.isNoAbilities) {
      let tsk = ab.tasks[0];
      if (tsk) {
        this.router.navigate(['/pers/task', tsk.id, false]);
      }
    }
    else {
      this.router.navigate(['/pers/ability', ab.id]);
    }
  }
}
