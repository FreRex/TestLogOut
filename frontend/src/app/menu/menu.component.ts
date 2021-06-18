import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { AuthUser } from '../auth/auth-user.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public isConference = false;
  public currentUser$: Observable<AuthUser>;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.currentUser$ = this.authService.currentUser$;
  }

  onLogout() {
    this.authService.logout();
  }
}
