import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormGroup, FormGroupDirective, NgForm, FormBuilder, Validators, FormControl, RequiredValidator, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSumbitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSumbitted));
  }
}

export class PasswordErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm ): boolean {
      // const isSumbitted = form && form.submitted;
      // console.table(form);
      // console.table(control);
      // console.table(form.errors);
      return !!(control?.dirty&&control.touched&&form?.hasError('passwordsDoNotMatch'));
  }
}

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

  matcher = new MyErrorStateMatcher();
  passwordMatcher = new PasswordErrorStateMatcher();

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required]]}, { validators: [this.passwordsMatchValidator, this.passwordLongEnoughValidator]});
  }

  // validator matches values in confirm password field and password field
  passwordsMatchValidator: ValidatorFn = (control: AbstractControl) : ValidationErrors | null => {
    console.log('validator called!');
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');

    if (password?.value.length !== passwordConfirm?.value.length) { return { passwordsDoNotMatch: true } }
    
    const toReturn = !!password 
    && !!passwordConfirm 
    && !(password.value===passwordConfirm.value) ? 
    { passwordsDoNotMatch: true} : null;

    return toReturn;
  }

  passwordLongEnoughValidator: ValidatorFn = (control: AbstractControl) : ValidationErrors | null => {
    const password = control.get('password');
    console.log(password?.errors);

    return password?.hasError('minlength') ? { passwordNotLongEnough: true}: null;
  }

  type: 'login' | 'signup' | 'reset' = 'signup';

  changeType(type: 'login' | 'signup' | 'reset') {
    this.type = type;
  }

  get email() {
    return this.form.get('email') as FormControl;
  }

  emailInvalid(): boolean{
    return this.email.hasError('email') && !this.email.hasError('required');
  }

  get password() {
    return this.form.get('password') as FormControl;
  }

  get passwordConfirm() {
    return this.form.get('passwordConfirm') as FormControl;
  }

  get passwordConfirmInvalid(): boolean {
    console.log("Password: "+ !!this.password);
    console.log("Password confirm "+!!this.passwordConfirm);
    // console.log("Password value: "+this.password.value);
    // console.log("Password confirm value: " + this.passwordConfirm.value);
    console.log(!(this.passwordConfirm.value===this.password.value))
    
    
    // console.log(this.password && this.passwordConfirm && !(this.password.value === this.passwordConfirm.value));
    return !!this.password && !!this.passwordConfirm && !(this.password.value === this.passwordConfirm.value);
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
    else return this.password.value === this.passwordConfirm.value;
  }

  async onSubmit(){
    this.loading = true;

    // grabs field values and defaults to empty string if null
    const email = this.email.value ?? "";
    const password = this.password.value ?? "";
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
