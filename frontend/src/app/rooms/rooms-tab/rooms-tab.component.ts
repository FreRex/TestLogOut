import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Room, RoomService } from 'src/app/rooms/room.service';
import { GenericRoomItemComponent } from 'src/app/rooms/rooms-tab/generic-room-item';
import { TableColumns } from 'src/app/shared/generic-table/generic-table.component';

@Component({
  selector: 'app-rooms-tab',
  templateUrl: './rooms-tab.component.html',
  styleUrls: ['./rooms-tab.component.scss'],
})
export class RoomsTabComponent extends GenericRoomItemComponent implements OnInit {

  searchStream$ = new BehaviorSubject('');
  rooms$: Observable<Room[]>;
  // @ViewChild('desktopButtons', { static: true }) desktopButtons: TemplateRef<any>;
  // @ViewChild('mobileOptions', { static: true }) mobileOptions: TemplateRef<any>;
  columns: TableColumns[] = [];

  ngOnInit() {
    this.columns = [
      { title: 'ID', key: 'id', type: 'number', size: 1, orderEnabled: true },
      { title: 'Data', key: 'data_inserimento', type: 'date', size: 1, orderEnabled: true },
      { title: 'Commessa', key: 'commessa', type: 'string', size: 1.5, orderEnabled: true },
      { title: 'Collaudatore', key: 'nome_collaudatore', type: 'string', size: 2, orderEnabled: true },
      { title: 'Usermobile', key: 'usermobile', type: 'string', size: 2, orderEnabled: true },
      { title: 'Progetto', key: 'nome_progetto', type: 'string', size: 2, orderEnabled: true },
      { title: 'Azioni', key: '', type: 'buttons', size: 2.5, orderEnabled: false/* , customTemplate: this.desktopButtons */ },
    ];

    this.rooms$ = this.searchStream$.pipe(
      // debounceTime(200), //FIX
      distinctUntilChanged(),
      startWith(""),
      switchMap((query) => {
        return this.roomService.getRoomsByFilter(query)
      })
    );
  }

  constructor(
    public router: Router,
    public roomService: RoomService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController) {
    super(
      router,
      roomService,
      authService,
      alertController,
      modalController,
      toastController
    );
  }

}
