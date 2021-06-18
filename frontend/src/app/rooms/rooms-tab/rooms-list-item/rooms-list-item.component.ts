import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { RoomService } from 'src/app/rooms/room.service';
import { GenericRoomItemComponent } from 'src/app/rooms/rooms-tab/generic-room-item.component';
import { MediaService } from '../../gallery/media.service';

@Component({
  selector: 'app-rooms-list-item',
  templateUrl: './rooms-list-item.component.html',
})
export class RoomsListItemComponent extends GenericRoomItemComponent {
  constructor(
    public router: Router,
    public navController: NavController,
    public roomsService: RoomService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController
  ) {
    super(
      router,
      navController,
      roomsService,
      authService,
      alertController,
      modalController,
      toastController
    );
  }

  openMedia(id: number, proj: string) {
    this.router.navigate([`/rooms/gallery/${id}/${proj}`]);
  }
}
