import { Component, OnInit } from '@angular/core';
import { PersService } from '../pers.service';
import { Enamy } from 'src/Models/Enamy';
import { Task } from 'src/Models/Task';
import { SvgIconRegistryService } from 'angular-svg-icon';

@Component({
  selector: 'app-enamies',
  templateUrl: './enamies.component.html',
  styleUrls: ['./enamies.component.css']
})
export class EnamiesComponent implements OnInit {

  //enamies: any[] = [];
  newEnamy: string = "";
  newEnamyLvl: number = 0;
  rndImg: string = "";

  constructor(private srv: PersService, private iconReg:SvgIconRegistryService) { }

  ngOnInit() {
    this.iconReg.loadSvg('assets/icons/sword.svg', 'ico');
    //this.srv.loadEnamies().subscribe(n => this.enamies = n);
    //let tsk = new Task();
  }

  getRnd() {
    
  }

  addEnamyToBase() {
    // let en: Enamy = new Enamy();
    // en.image = this.newEnamy;
    // en.lvl = this.newEnamyLvl;
    // en.rnd = Math.random();
    this.newEnamy = "";
  }

}
