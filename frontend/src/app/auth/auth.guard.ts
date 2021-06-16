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
import { Storage } from '@capacitor/storage';
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
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
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
        if (!isAuthenticated) {
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }

  canActivate(route: ActivatedRouteSnapshot) {
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
        if (!isAuthenticated) {
          if (route.routeConfig.path == 'conference') {
            Storage.set({
              key: 'roomData',
              value: JSON.stringify({
                roomId: decodeURIComponent(route.queryParams['roomId']),
                session: decodeURIComponent(route.queryParams['session']),
                project: decodeURIComponent(route.queryParams['project']),
                creator: decodeURIComponent(route.queryParams['creator']),
              }),
            });
            // this.router.navigate(['/auth'], {
            //   queryParams: {
            //     roomId: route.queryParams['roomId'],
            //     session: route.queryParams['session'],
            //     project: route.queryParams['project'],
            //     creator: route.queryParams['creator'],
            //   },
            // });
          }
          // else {
          //   this.router.navigate(['/auth']);
          // }
          this.router.navigate(['/auth']);
        }
      })
    );
  }
}
