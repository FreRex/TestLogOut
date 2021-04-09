import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonSelect, ModalController, ViewDidEnter, ViewDidLeave, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Room, RoomService } from './room.service';
import { NewRoomModalComponent } from '../shared/modals/new-room-modal/new-room-modal.component';
import { AuthService } from '../auth/auth.service';
import { filter, mergeMap, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-room',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private roomService: RoomService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.queryParams.pipe(
      switchMap(params => {
        // console.log("user exist", !!params['user'], "is a number", !isNaN(params['user']), "is not 0", params['user'] !== '0');
        //if(x) = check if x is negative, undefined, null or empty 
        // isNaN(x) = determina se un valore è NaN o no
        if (params && params['user'] && !isNaN(params['user']) && params['user'] !== '0' && params['user'] !== '1') {
          this.authService.onLogin(params['user']);
        } else {
          this.authService.onLogin('0');
        }
        return this.roomService.rooms$;
      }),
    ).subscribe((rooms: Room[]) => {
      // mi sottoscrivo all'osservabile "get rooms()" che restituisce la lista di room
      // questa funzione viene eseguita qualsiasi volta la lista di room cambia
    });
  }

}
