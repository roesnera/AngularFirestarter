import { Injectable } from '@angular/core';
import { signInWithPopup, signInWithRedirect } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth } from '@angular/fire/auth';
import { GoogleAuthProvider, AuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: Auth) { }

  googleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  async AuthLogin(provider: AuthProvider) {
    await signInWithPopup(this.afAuth, new GoogleAuthProvider())
  }

  signedIn(): boolean {
    console.log(this.afAuth.currentUser)
    return !!this.afAuth.currentUser;
  }

  logout() {
    this.afAuth.signOut();
  }
}
