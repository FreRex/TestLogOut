import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonItemSliding, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { GenericRoomsItemComponent } from 'src/app/shared/generic-rooms-item/generic-rooms-item.component';
import { RoomService } from '../../../../rooms/room.service';

@Component({
  selector: 'app-rooms-list-item',
  templateUrl: './rooms-list-item.component.html',
  styleUrls: ['./rooms-list-item.component.scss'],
})
export class RoomsListItemComponent extends GenericRoomsItemComponent {

  constructor(
    public router: Router,
    public roomsService: RoomService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController
  ) {
    super(
      router,
      roomsService,
      authService,
      alertController,
      modalController,
      toastController
    );
  }




}