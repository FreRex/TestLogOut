import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Room, RoomService } from './room.service';
import { AuthService } from '../auth/auth.service';
import { delay, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { GenericRoomItemComponent } from '../shared/generic-items/generic-room-item.component';
import { TableColumns } from '../shared/generic-table/generic-table.component';
import { StorageDataService } from '../shared/storage-data.service';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-room',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage extends GenericRoomItemComponent implements OnInit {

  searchStream$ = new BehaviorSubject('');
  rooms$: Observable<Room[]>;
  columns: TableColumns[] = [];
  // @ViewChild('desktopButtons', { static: true }) desktopButtons: TemplateRef<any>;

  ngOnInit() {
    this.columns = [
      { title: 'ID', key: 'id', type: 'number', size: 1, orderEnabled: true },
      { title: 'Data', key: 'data_inserimento', type: 'date', size: 1, orderEnabled: true },
      { title: 'Collaudatore', key: 'nome_collaudatore', type: 'string', size: 2, orderEnabled: true },
      { title: 'Usermobile', key: 'usermobile', type: 'string', size: 2, orderEnabled: true },
      { title: 'Progetto', key: 'nome_progetto', type: 'string', size: 3, orderEnabled: true },
      { title: 'Azioni', key: '', type: 'buttons', size: 3, orderEnabled: false/* , customTemplate: this.desktopButtons */ },
    ];

    // this.rooms$ = this.searchStream$.pipe(
    //   // debounceTime(200), //FIX
    //   distinctUntilChanged(),
    //   startWith(""),
    //   switchMap((query) => {
    //     return this.roomService.getRoomsByFilter(query)
    //   })
    // );

    this.rooms$ = this.route.queryParams.pipe(
      switchMap(params => {
        //if(x) = check if x is negative, undefined, null or empty 
        // isNaN(x) = determina se un valore è NaN o no
        if (params && params['user'] /*&& !isNaN(params['user'])*/ && params['user'] !== '0' && params['user'] !== '1') {
          console.log('params: ', params['user']);
          this.authService.onLogin(+params['user']);
          this.dataService.loadData();
        } else {
          this.authService.onLogin(0);
          this.dataService.loadData();
        }
        return this.searchStream$;
      }),
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
    private route: ActivatedRoute,
    public roomService: RoomService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController,
    public dataService: StorageDataService,
    private userService: UserService
  ) {
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
