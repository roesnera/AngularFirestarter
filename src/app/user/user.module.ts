import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { GoogleSigninDirective } from './google-signin.directive';
import { EmailLoginComponent } from './email-login/email-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    UserComponent,
    LoginPageComponent,
    GoogleSigninDirective,
    EmailLoginComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class UserModule { }
