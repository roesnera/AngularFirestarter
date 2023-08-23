import { Injectable } from '@angular/core';
import { signInWithPopup, signInWithRedirect } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth } from '@angular/fire/auth';
import { GoogleAuthProvider, AuthProvider } from 'firebase/auth';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: Auth, private fb: FormBuilder) { }

  googleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  async AuthLogin(provider: AuthProvider) {
    await signInWithPopup(this.afAuth, new GoogleAuthProvider())
  }

  signedIn(): boolean {
    // console.log(this.afAuth.currentUser);
    return !!this.afAuth.currentUser;
  }

  getEmail() {
    if(this.afAuth.currentUser){
    return this.afAuth.currentUser.email;
    }
    return "email not found";
  }

  logout() {
    this.afAuth.signOut();
  }

  async signInWithEmailAndPassword(email: any, password: any) {
    await this.signInWithEmailAndPassword(email, password);
  }

  async createUserWithEmailAndPassword(email: any, password: any) {
    await this.createUserWithEmailAndPassword(email, password);
  }

  async sendPasswordResetEmail(email: any) {
    await this.sendPasswordResetEmail(email);
  }

}
