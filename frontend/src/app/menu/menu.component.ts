import { Component, OnInit, ViewChild } from '@angular/core';
import { IonMenu } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Socket } from 'ngx-socket-io';
import { AuthUser } from '../auth/auth-user.model';
import { Room, RoomService } from '../rooms/room.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @ViewChild('menu', { static: true }) ionMenu: IonMenu;

  public currentUser$: Observable<AuthUser>;
  public currentRoom$: Observable<Room>;

  constructor(
    public authService: AuthService,
    public roomService: RoomService,
    public socket: Socket
  ) {}

  ngOnInit() {
    this.ionMenu.ionWillOpen.subscribe((willOpen) => {
      this.currentUser$ = this.authService.currentUser$;
      this.currentRoom$ = this.roomService.currentRoom$;
    });
  }

  onLogout() {
    this.authService.logout();
    this.socket.disconnect(); 
    setTimeout(() => {
      this.socket.connect();
    }, 1000);
  }
}
