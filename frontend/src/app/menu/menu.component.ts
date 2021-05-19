import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { shareReplay, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private router: Router) {}
  private previousAuthState = false;

  ngOnInit() {
    this.authService.userIsAuthenticated$
      .pipe(
        shareReplay({ refCount: true, bufferSize: 1 }),
        takeUntil(this.destroy$)
      )
      .subscribe((isAuth) => {
        if (!isAuth && this.previousAuthState !== isAuth) {
          this.router.navigateByUrl('/auth');
        }
        this.previousAuthState = isAuth;
      });
  }

  destroy$ = new Subject();
  ngOnDestroy() {
    this.destroy$.next();
  }

  onLogout() {
    this.authService.logout();
  }

  onLogin() {
    this.router.navigateByUrl('/auth');
  }
}
