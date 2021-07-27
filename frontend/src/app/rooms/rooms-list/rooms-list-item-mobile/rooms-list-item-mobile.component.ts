import { Component, Input } from '@angular/core';
import { Room } from 'src/app/rooms/room.service';

import { RoomFunctionsService } from '../../room-functions.service';

@Component({
  selector: 'app-rooms-list-item-mobile',
  templateUrl: './rooms-list-item-mobile.component.html',
})
export class RoomsListItemMobileComponent {
  @Input() room: Room;

  constructor(public roomFunctions: RoomFunctionsService) {}
}
