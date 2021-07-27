import { Component, Input } from '@angular/core';
import { Room } from 'src/app/rooms/room.service';

import { RoomFunctionsService } from '../../room-functions.service';

@Component({
  selector: 'app-rooms-list-item-desktop',
  templateUrl: './rooms-list-item-desktop.component.html',
  styleUrls: ['../../../shared/generic-table/generic-table.component.scss'],
})
export class RoomsListItemDesktopComponent {
  @Input() columns;
  @Input() room: Room;

  constructor(public roomFunctions: RoomFunctionsService) {}
}
