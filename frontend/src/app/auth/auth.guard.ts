import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad, CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('🐱‍👤 : AuthGuard : canLoad : route', route);
    console.log('🐱‍👤 : AuthGuard : canLoad : segments', segments);
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      switchMap((isAuthenticated) => {
        if (!isAuthenticated) {
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
      tap((isAuthenticated) => {
        console.log('🐱‍👤 : AuthGuard : isAuthenticated', isAuthenticated);
        if (!isAuthenticated) {
          if (segments[0].toString() == 'conference') {
            this.router.navigateByUrl('/auth');
          }
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }

  canActivate(route: ActivatedRouteSnapshot) {
    console.log('🐱‍👤 : AuthGuard : canActivate : route', route);
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      switchMap((isAuthenticated) => {
        if (!isAuthenticated) {
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
      tap((isAuthenticated) => {
        console.log('🐱‍👤 : AuthGuard : isAuthenticated', isAuthenticated);
        console.log('🐱‍👤 : AuthGuard : route.routeConfig.path', route.routeConfig.path);
        if (!isAuthenticated) {
          if (route.routeConfig.path == 'conference') {
            console.log(route.queryParams['room']);
            this.router.navigate(['/auth'], { queryParams: { room: route.queryParams['room'] } });
          } else {
            this.router.navigate(['/auth']);
          }
        }
      })
    );
  }
}
