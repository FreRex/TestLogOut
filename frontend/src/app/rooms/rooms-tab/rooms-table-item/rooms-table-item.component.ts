import { Component, Input } from '@angular/core';
import { Room } from 'src/app/rooms/room.service';

import { RoomItemFunctions } from '../../room-item-functions';

@Component({
  selector: 'app-rooms-table-item',
  templateUrl: './rooms-table-item.component.html',
  styleUrls: ['../../../shared/generic-table/generic-table.component.scss'],
})
export class RoomsTableItemComponent {
  @Input() columns;
  @Input() room: Room;

  constructor(public roomFunctions: RoomItemFunctions) {}
}
