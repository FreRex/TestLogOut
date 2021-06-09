import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { RoomService } from 'src/app/rooms/room.service';
import { GenericRoomItemComponent } from 'src/app/rooms/rooms-tab/generic-room-item.component';
import { MediaService } from '../../gallery/media.service';

@Component({
  selector: 'app-rooms-table-item',
  templateUrl: './rooms-table-item.component.html',
  styleUrls: ['../../../shared/generic-table/generic-table.component.scss'],
})
export class RoomsTableItemComponent extends GenericRoomItemComponent {
  @Input() columns;

  constructor(
    public router: Router,
    public roomsService: RoomService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController
  ) {
    super(router, roomsService, authService, alertController, modalController, toastController);
  }

  openMedia(id: number, proj: string) {
    this.router.navigate([`/rooms/gallery/${id}/${proj}`]);
  }
}
