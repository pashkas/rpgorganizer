import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { PersService } from './pers.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'rpgorganizer';

  constructor(public srv: PersService, private router: Router) {
  }

  isNoLogin(){
    return this.router.url != '/login';
  }
}
