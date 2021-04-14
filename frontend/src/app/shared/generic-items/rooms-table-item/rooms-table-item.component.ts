import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { GenericRoomItemComponent } from 'src/app/shared/generic-items/generic-room-item.component';
import { RoomService } from 'src/app/rooms/room.service';

@Component({
  selector: 'app-rooms-table-item',
  templateUrl: './rooms-table-item.component.html',
  styleUrls: ['../../generic-table/generic-table.component.scss'],
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
    super(
      router,
      roomsService,
      authService,
      alertController,
      modalController,
      toastController
    );
  }

  ngOnInit() {
    console.log('here');

  }
}
