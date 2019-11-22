import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public db: AngularFirestore,
    public afAuth: AngularFireAuth) { }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      // let provider = new firebase.auth.GoogleAuthProvider();
      // provider.addScope('profile');
      // provider.addScope('email');
      this.afAuth.auth
        .signInWithPopup(new auth.GoogleAuthProvider())
        .then(res => {
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        })
    })
  }

}
