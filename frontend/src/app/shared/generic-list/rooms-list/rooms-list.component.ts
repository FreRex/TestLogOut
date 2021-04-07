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

  searchStream$ = new BehaviorSubject('');
  rooms$: Observable<Room[]>;
  datas = [
    { title: 'Progetto', key: 'nome_progetto', type: 'string', primary: true },
    { title: 'Usermobile', key: 'usermobile', type: 'string', primary: false },
  ];

  constructor(private roomService: RoomService) {
    super();
  }

  doRefresh(event) {
    this.roomService.loadRooms().subscribe(res => { event.target.complete(); });
  }

  filterData(query: any): Observable<any[]> {
    return this.roomService.getRoomsByFilter(query);
  }

}
