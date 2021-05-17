import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
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
  })

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.authService.userName.subscribe(console.log);
    this.authService.userIsAuthenticated.subscribe(console.log);
  }

  authenticate() {
    if (!this.form.valid) { return; }

    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in..' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<any>;
        if (this.isLogin) {
          authObs = this.authService.login(this.form.value.username, this.form.value.password);
        } else {
          authObs = this.authService.signup(this.form.value.username, this.form.value.password);
        }
        authObs.subscribe(
          res => {
            this.isLoading = false;
            loadingEl.dismiss();
            this.showAlert('gg');
            // this.router.navigateByUrl('/rooms');
          }, err => {
            this.isLoading = false;
            loadingEl.dismiss();
            this.showAlert('errore');
          });
      });
  }

  private showAlert(message: string) {
    this.alertController.create({
      header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    }).then(alertEl =>
      alertEl.present()
    );
  }
}
