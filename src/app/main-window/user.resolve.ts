import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { FirebaseUserModel } from 'src/Models/User';
import { UserService } from '../user.service';


@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<FirebaseUserModel> {

  constructor(public userService: UserService, private router: Router) { }

  async resolve(route: ActivatedRouteSnapshot): Promise<FirebaseUserModel> {
    let user = new FirebaseUserModel();

    return await new Promise((resolve, reject) => {
      this.userService.getCurrentUser()
        .then(res => {
          user.name = res.displayName;
          user.provider = res.providerData[0].providerId;
          user.id = res.uid;
          
          return resolve(user);
        }, err => {
          this.router.navigate(['/login']);

          return reject(err);
        })
    })
  }
}
