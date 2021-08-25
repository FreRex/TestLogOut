import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { App, AppState } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private previousAuthState = false;
  private authSub: Subscription;

  constructor(
    private router: Router,
    private platform: Platform,
    private authService: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        SplashScreen.hide();
      }
    });
  }

  ngOnInit() {
    var orientation = screen.orientation;
    console.log('🐱‍👤 : orientation', orientation);
    // window.screen.orientation.lock('portrait');
    screen.orientation.addEventListener('change', (orientation) => {
      console.log('🐱‍👤 : orientation', orientation);
    });
    if (this.platform.is('mobile')) {
      App.addListener('appStateChange', this.checkAuthOnResume.bind(this));
    }
    this.authSub = this.authService.userIsAuthenticated.subscribe((isAuth) => {
      if (!isAuth && this.previousAuthState !== isAuth) {
        this.router.navigateByUrl('/auth');
      }
      this.previousAuthState = isAuth;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
    // App.removeListener('appStateChange', this.checkAuthOnResume);
  }

  private checkAuthOnResume(state: AppState) {
    if (state.isActive) {
      this.authService
        .autoLogin()
        .pipe(take(1))
        .subscribe((success) => {
          if (!success) {
            this.onLogout();
          }
        });
    }
  }
}
