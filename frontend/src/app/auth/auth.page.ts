import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, OnDestroy {
  isLogin: boolean = true;

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
        authObs
          // .pipe(
          //   shareReplay({ refCount: true, bufferSize: 1 }),
          //   takeUntil(this.destroy$)
          // )
          .subscribe(
            (res) => {
              this.form.reset();
              loadingEl.dismiss();
              this.router.navigateByUrl('/rooms');
            },
            (err) => {
              this.form.reset();
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

  destroy$ = new Subject();
  ngOnDestroy() {
    this.destroy$.next();
  }
}
