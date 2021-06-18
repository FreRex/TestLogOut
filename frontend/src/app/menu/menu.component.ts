import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { AuthUser } from '../auth/auth-user.model';
import { Room, RoomService } from '../rooms/room.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public isConference = false;
  public currentUser$: Observable<AuthUser>;
  public currentRoom$: Observable<Room>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.currentUser$ = this.authService.currentUser$;
    this.currentRoom$ = this.roomService.currentRoom$;
  }

  onLogout() {
    this.authService.logout();
  }
}
