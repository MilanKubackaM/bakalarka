import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
  ) {}

  isLoginVisible: boolean = true;
  @Output() loginSuccess: EventEmitter<string> = new EventEmitter<string>();
  alreadyLoggedIn = false;
  @ViewChild('closebutton') closebutton: any;

  ngOnInit() {
  }

  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  loginForm: FormGroup = new FormGroup({
    usernameLog: new FormControl('', [Validators.required, Validators.email]),
    passwordLog: new FormControl('', [Validators.required]),
  })

  loginWithGoogle() {
    this.authService.signInWithGoogle().then((res: any) => {
      this.closebutton.nativeElement.click();
    }).catch((error: any) => {
      console.error(error);
    })
  }

  loginWithEmailAndPassword() {
    const userData = Object.assign(this.loginForm.value, { email: this.loginForm.value.usernameLog, password: this.loginForm.value.passwordLog });
    this.authService.signInWithEmailAndPassword(userData).then((res: any) => {
      this.loginSuccess.emit(res.user.email.split('@')[0]);
      this.closebutton.nativeElement.click();
    }).catch((error: any) => {
      console.error(error);
    });
  }

  registerWithEmailAndPassword() {
    this.validateRegistrationForm();

    if (this.registerForm.valid) {
      const userData = Object.assign(this.registerForm.value, { email: this.registerForm.value.username });
      this.authService.registerWithEmailAndPassword(userData).then((res: any) => {
        this.registerForm.reset();
        this.closebutton.nativeElement.click();
      }).catch((error: any) => {
        console.error(error);
      });
    } else {
      this.markFormControlsAsTouched(this.registerForm);
    }
  }

  private validateRegistrationForm() {
    const passwordControl = this.registerForm.get('password');
    const confirmPasswordControl = this.registerForm.get('confirmPassword');

    if (passwordControl && confirmPasswordControl) {
      const password = passwordControl.value;
      const confirmPassword = confirmPasswordControl.value;

      if (password !== confirmPassword) {
        confirmPasswordControl.setErrors({ passwordsNotMatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  private markFormControlsAsTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordsNotMatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }

    return null;
  }

  toggleForm() {
    this.isLoginVisible = !this.isLoginVisible;
  }

  mapUser(user: any) {
    return {
      'uid': user.uid,
      'email': user.email
    }
  }
}
