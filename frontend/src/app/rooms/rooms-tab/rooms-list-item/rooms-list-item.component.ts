import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Room, RoomService } from 'src/app/rooms/room.service';
import { RoomItemFunctions } from '../../room-item-functions';

@Component({
  selector: 'app-rooms-list-item',
  templateUrl: './rooms-list-item.component.html',
})
export class RoomsListItemComponent {
  @Input() room: Room;

  constructor(public roomFunctions: RoomItemFunctions) {}
}
