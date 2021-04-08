import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Room, RoomService } from 'src/app/rooms/room.service';
import { GenericListComponent } from '../generic-list.component';


@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.scss'],
})
export class RoomsListComponent extends GenericListComponent {

  constructor(private roomService: RoomService) {
    super();
  }
  filterData(query: any): Observable<any[]> {
    return this.roomService.getRoomsByFilter(query);
  }
  doRefresh(event) {
    this.roomService.loadRooms().subscribe(res => { event.target.complete(); });
  }
  createRoom() {

  }
}
