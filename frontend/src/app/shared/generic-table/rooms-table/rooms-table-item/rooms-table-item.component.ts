import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { GenericRoomsItemComponent } from 'src/app/shared/generic-rooms-item/generic-rooms-item.component';
import { RoomService } from 'src/app/rooms/room.service';

@Component({
  selector: 'app-rooms-table-item',
  templateUrl: './rooms-table-item.component.html',
  styleUrls: ['./rooms-table-item.component.scss'],
})
export class RoomsTableItemComponent extends GenericRoomsItemComponent {

  @Input() datas;

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

  ngOnInit() { }

}
