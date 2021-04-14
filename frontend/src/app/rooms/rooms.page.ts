import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Room, RoomService } from './room.service';
import { AuthService } from '../auth/auth.service';
import { distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { GenericRoomItemComponent } from '../shared/generic-items/generic-room-item.component';
import { TableColumns } from '../shared/generic-table/generic-table.component';

@Component({
  selector: 'app-room',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage extends GenericRoomItemComponent implements OnInit {

  searchStream$ = new BehaviorSubject('');
  rooms$: Observable<Room[]>;
  @ViewChild('desktopButtons', { static: true }) desktopButtons: TemplateRef<any>;
  columns: TableColumns[] = [];

  ngOnInit() {
    this.columns = [
      { title: 'ID', key: 'id', type: 'number', size: 1, orderEnabled: true },
      { title: 'Data', key: 'data_inserimento', type: 'date', size: 1, orderEnabled: true },
      { title: 'Collaudatore', key: 'nome_collaudatore', type: 'string', size: 2, orderEnabled: true },
      { title: 'Usermobile', key: 'usermobile', type: 'string', size: 2, orderEnabled: true },
      { title: 'Progetto', key: 'nome_progetto', type: 'string', size: 3, orderEnabled: true },
      { title: 'Azioni', key: '', type: 'buttons', size: 3, orderEnabled: false, customTemplate: this.desktopButtons },
    ];

    this.rooms$ = this.searchStream$.pipe(
      // debounceTime(200), //FIX
      distinctUntilChanged(),
      startWith(""),
      switchMap((query) => {
        return this.roomService.getRoomsByFilter(query)
      })
    );

    // this.rooms$ = this.route.queryParams.pipe(
    //   switchMap(params => {
    //     // console.log("user exist", !!params['user'], "is a number", !isNaN(params['user']), "is not 0", params['user'] !== '0');
    //     //if(x) = check if x is negative, undefined, null or empty 
    //     // isNaN(x) = determina se un valore è NaN o no
    //     if (params && params['user'] && !isNaN(params['user']) && params['user'] !== '0' && params['user'] !== '1') {
    //       this.authService.onLogin(params['user']);
    //     } else {
    //       this.authService.onLogin('0');
    //     }
    //     return this.searchStream$;
    //   }),
    //   // debounceTime(200), //FIX
    //   distinctUntilChanged(),
    //   startWith(""),
    //   switchMap((query) => {
    //     return this.roomService.getRoomsByFilter(query)
    //   })
    // );
  }

  constructor(
    public router: Router,
    private route: ActivatedRoute,
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
