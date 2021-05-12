import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable, timer, of, forkJoin, concat } from 'rxjs';
import { delay, delayWhen, map, retryWhen, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../users-tab/user.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {



  constructor(
    private http: HttpClient,
    private userService: UserService,
    private authService: AuthService
  ) { }

  searchCity(nomeCity: string) {
    return this.http
      .get(
        `https://www.gerriquez.com/comuni/ws.php?dencomune=${nomeCity}`,
      )
  }


}
