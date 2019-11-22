import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import {CanActivate, ActivatedRouteSnapshot, Router} from "@angular/router";
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public afAuth: AngularFireAuth,
    public userService: UserService,
    private router: Router
  ) {}

  canActivate(): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.userService.getCurrentUser()
      .then(user => {
        this.router.navigate(['/main']);
        return resolve(false);
      }, err => {
        return resolve(true);
      })
    })
  }
}
