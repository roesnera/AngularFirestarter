import { Directive, HostListener } from '@angular/core';
import { AuthService } from './auth.service';

@Directive({
  selector: '[appGoogleSignin]'
})
export class GoogleSigninDirective {

  constructor(private authService: AuthService) { }

  @HostListener('click')
  onclick() {
    this.authService.googleAuth();
  }
}
