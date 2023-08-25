import { Auth, User } from '@angular/fire/auth';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { SnackService } from '../services/snack.service';


// injects the auth service, then returns true if there is a current user, false otherwise
export const authGuard: CanActivateFn = (route, state): boolean => {
  const auth: AuthService = inject(AuthService);
  const user: User | null = auth.afAuth.currentUser;

  const isLoggedIn: boolean = !!user;

  if(!isLoggedIn) {
    const snack = inject(SnackService);
    snack.authError();
  }

  return isLoggedIn;
};
