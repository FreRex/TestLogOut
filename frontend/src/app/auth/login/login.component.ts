import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLogin: boolean = true;

  form: FormGroup = this.fb.group({
    username: ['', { validators: [Validators.required] /* , updateOn: 'blur' */ }],
    password: ['', { validators: [Validators.required] /* , updateOn: 'blur' */ }],
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  showPassword: boolean;
  formSubmitted: boolean = false;

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  authenticate() {
    this.formSubmitted = true;
    if (!this.form.valid) {
      return;
    }

    this.loadingCtrl.create({ keyboardClose: true, message: 'Logging in..' }).then((loadingEl) => {
      loadingEl.present();
      let authObs: Observable<any>;
      if (this.isLogin) {
        authObs = this.authService.login(this.form.value.username, this.form.value.password);
      } else {
        authObs = this.authService.signup(this.form.value.username, this.form.value.password);
      }
      authObs.subscribe(
        (res) => {
          this.form.reset();
          loadingEl.dismiss();
          this.router.navigateByUrl('/rooms');
        },
        (err) => {
          console.log('🐱‍👤 : LoginComponent : err', err);
          loadingEl.dismiss();
          this.showAlert(err);
        }
      );
    });
  }

  private showAlert(message: string) {
    this.alertController
      .create({
        header: 'Autenticazione fallita',
        message: message,
        buttons: ['Okay'],
      })
      .then((alertEl) => alertEl.present());
  }
}
