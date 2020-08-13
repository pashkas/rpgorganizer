import { Component, OnInit } from '@angular/core';
import { PersService } from '../pers.service';

@Component({
  selector: 'app-rest',
  templateUrl: './rest.component.html',
  styleUrls: ['./rest.component.css']
})
export class RestComponent implements OnInit {

  constructor(private srv: PersService) { }

  ngOnInit() {
  }

  returnFromRest(){
    this.srv.returnToAdventure();
  }
}
