import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormBuilder, Validators, FormControl, RequiredValidator } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss'],
})
export class EmailLoginComponent implements OnInit {
  form!: FormGroup;

  loading: boolean = false;

  constructor(public authService: AuthService, private fb: FormBuilder) {
  }

  serverMessage: string= "";

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required, Validators.minLength(6)],
      passwordConfirm: ['']});
  }

  type: 'login' | 'signup' | 'reset' = 'signup';

  changeType(type: 'login' | 'signup' | 'reset') {
    this.type = type;
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }

  get isLogin(): boolean {
    return this.type === 'login';
  }

  get isSignup(): boolean {
    return this.type === 'signup';
  }

  get isPasswordReset(): boolean {
    return this.type === 'reset';
  }

  get passwordDoesMatch(): boolean {
    if(this.type !== 'signup') return true;
    else return this.password === this.passwordConfirm;
  }

  async onSubmit(){
    this.loading = true;

    // grabs field values and defaults to empty string if null
    const email = this.email ?? "";
    const password = this.password ?? "";
    // if the email or password field is empty, return immediately
    // if(!email||!password){
    //   this.loading = false;
    //   return;
    // }

    try {
      if (this.isLogin){
        await this.authService.signInWithEmailAndPassword(email, password);
      }
      if (this.isSignup){
        await this.authService.createUserWithEmailAndPassword(email, password);
      }
      if (this.isPasswordReset){
        await this.authService.sendPasswordResetEmail(email);
        this.serverMessage = "Check your email";
      }
    } catch(e: any){ {
      this.serverMessage = e.message;
    }

    this.loading = false;
    }
  }

}
