import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLogin: boolean = true;
  isLoading: boolean;

  form: FormGroup = this.fb.group({
    username: [null, [Validators.required]],
    password: [null, [Validators.required]],
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  authenticate() {
    if (!this.form.valid) {
      return;
    }

    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in..' })
      .then((loadingEl) => {
        loadingEl.present();
        let authObs: Observable<any>;
        if (this.isLogin) {
          authObs = this.authService.login(
            this.form.value.username,
            this.form.value.password
          );
        } else {
          authObs = this.authService.signup(
            this.form.value.username,
            this.form.value.password
          );
        }
        authObs.subscribe(
          (res) => {
            console.log('this.loadingCtrl.create -> res', res);
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/rooms');
          },
          (err) => {
            console.log('this.loadingCtrl.create -> err', err);
            this.isLoading = false;
            loadingEl.dismiss();
            this.showAlert(err);
          }
        );
      });
  }

  private showAlert(message: string) {
    this.alertController
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay'],
      })
      .then((alertEl) => alertEl.present());
  }
}
