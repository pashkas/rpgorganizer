import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { FirebaseUserModel } from 'src/Models/User';
import { UserService } from '../user.service';
import { PersService } from '../pers.service';
import { take } from 'rxjs/operators';
import { Pers } from 'src/Models/Pers';


@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<FirebaseUserModel> {

  constructor(public userService: UserService, private router: Router, private srv: PersService) { }

  resolve(route: ActivatedRouteSnapshot): Promise<FirebaseUserModel> {

    let user = new FirebaseUserModel();

    return new Promise((resolve, reject) => {
      this.userService.getCurrentUser()
        .then(res => {
          user.name = res.displayName;
          user.provider = res.providerData[0].providerId;
          user.id = res.uid;

          this.srv.loadPers(user.id)
            .pipe(take(1))
            .subscribe(data => {
              // Если перс есть
              if (data != undefined) {
                const pers = data;
                const prs = (pers as Pers);

                if (prs.tasks && prs.tasks.length > 0) {
                  prs.currentTaskIndex = 0;
                  prs.currentTask = prs.tasks[0];
                }

                this.srv.checkPersNewFields(prs);

                this.srv.pers = prs;

                if (this.srv.checkNullOrUndefined(this.srv.pers.prevOrderSeq)
                  || this.srv.checkNullOrUndefined(this.srv.pers.curOrderSeq)
                  || this.srv.checkNullOrUndefined(this.srv.pers.curEndOfListSeq)
                ) {
                  this.srv.pers.prevOrderSeq = 0;
                  this.srv.pers.curOrderSeq = 0;
                  this.srv.pers.curEndOfListSeq = 9999;
                }

                // Если наступил следующий день, меняем счетчики
                let curDate = new Date().setHours(0, 0, 0, 0);
                let lastUse = new Date(this.srv.pers.dateLastUse).setHours(0, 0, 0, 0);
                if (curDate.valueOf() > lastUse.valueOf()) {
                  this.srv.pers.prevOrderSeq = this.srv.pers.curOrderSeq;
                  this.srv.pers.curOrderSeq = 0;
                  this.srv.pers.curEndOfListSeq = 9999;

                  this.srv.savePers(false);
                }
              }
              // Если перса пока что не было
              else if (data === undefined && user.id != undefined && user.id != null) {
                const pers = new Pers();
                pers.userId = user.id;
                pers.id = user.id;
                pers.level = 0;

                this.srv.checkPersNewFields(pers);

                this.srv.pers = pers;

                this.srv.savePers(false, false);
              } else {
                this.router.navigate(['/login']);

                return reject();
              }

              return resolve(user);
            });
        }, err => {
          this.router.navigate(['/login']);

          return reject(err);
        })
    })
  }
}
