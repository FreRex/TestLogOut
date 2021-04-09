import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { GenericTableComponent, TableData } from 'src/app/shared/generic-table/generic-table.component';
import { RoomService } from '../../../rooms/room.service';
import { NewRoomModalComponent } from '../../modals/new-room-modal/new-room-modal.component';

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

  constructor(
    private roomService: RoomService,
    private modalController: ModalController
  ) { super(); }

  filterData(query: any): Observable<any[]> {
    return this.roomService.getRoomsByFilter(query);
  }
  doRefresh(event) {
    this.roomService.loadRooms().subscribe(res => { event.target.complete(); });
  }
  /** Apre il modale di MODIFICA ROOM */
  createRoom() {
    this.modalController
      .create({
        component: NewRoomModalComponent,
        backdropDismiss: false,
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      });
  }
}