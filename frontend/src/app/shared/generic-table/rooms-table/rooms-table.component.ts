import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericTableComponent, TableData } from 'src/app/shared/generic-table/generic-table.component';
import { RoomService } from '../../../rooms/room.service';

@Component({
  selector: 'app-rooms-table',
  templateUrl: './rooms-table.component.html',
  styleUrls: ['./rooms-table.component.scss'],
})
export class RoomsTableComponent extends GenericTableComponent {

  datas: TableData[] = [
    { title: 'ID', key: 'id', type: 'number', size: 1 },
    { title: 'Data', key: 'data_inserimento', type: 'date', size: 1 },
    { title: 'Collaudatore', key: 'nome_collaudatore', type: 'string', size: 2 },
    { title: 'Usermobile', key: 'usermobile', type: 'string', size: 2 },
    { title: 'Progetto', key: 'nome_progetto', type: 'string', size: 3 },
    { title: 'Azioni', key: 'azioni', type: 'buttons', size: 3 },
  ];

  constructor(private roomService: RoomService) {
    super();
  }

  filterData(query: any): Observable<any[]> {
    return this.roomService.getRoomsByFilter(query);
  }

  createRoom() {

  }
}