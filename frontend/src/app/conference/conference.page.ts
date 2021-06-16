import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { NavController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { from } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthService } from '../auth/auth.service';
import { Room, RoomService } from '../rooms/room.service';
import { PlayerComponent } from './player/player.component';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.page.html',
  styleUrls: ['./conference.page.scss'],
})
export class ConferencePage implements OnInit, AfterViewInit {
  @ViewChild(PlayerComponent) private playerComponent: PlayerComponent;
  public room: Room;

  roomId: string = '';
  userId: string = '';

  flvOrigin: string = '';
  rtmpDestination: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private roomService: RoomService,
    private authService: AuthService,
    private socket: Socket,
    private router: Router
  ) {}

  isLoading: boolean = false;
  ngOnInit() {
    /*
    * Rimuove i parametri dalla url 
    ! Corretto metterlo all'inizio?   
    */
    this.activatedRoute.queryParamMap.subscribe((paramMap) => {
      this.router.navigate([], {
        replaceUrl: true,
        relativeTo: this.activatedRoute,
      });
    });

    /*
     * Recupera l'ID della room,
     * l'utente corrente,
     * recupera i dati completi della room
     * e configura il socket
     */
    this.isLoading = true;
    /* 
    ? Meglio passare i parametri con: 
    - localStorage, 
    - queryParams, 
    - servizio/osservabili o 
    - NavigationExtras { state }
    */
    // this.activatedRoute.queryParams
    from(Storage.get({ key: 'roomData' }))
      .pipe(
        switchMap(
          // (params) => {
          // if (!params || !params['roomId']) {
          (storedData) => {
            if (!storedData || !storedData.value) {
              throw new Error('Missing ID');
            }
            // this.roomId = params['roomId'];
            this.roomId = JSON.parse(storedData.value).roomId;
            return this.authService.currentUser$;
          }
        ),
        take(1),
        switchMap((user) => {
          if (!user) {
            throw new Error('Unauthenticated');
          }
          this.userId = user.idutcas;
          return this.roomService.selectRoom(this.roomId);
        }),
        tap((room) => {
          if (!room) {
            throw new Error('Room Not Found');
          }
          this.room = room;
          /* 
          ? Ha senso mantenere anche i dati della room sul localStorage?
          ! Potrebbe essere problematico?
          */
          Storage.set({
            key: 'roomData',
            value: JSON.stringify({
              roomId: this.room.id,
              session: this.room.sessione,
              project: this.room.progetto,
              creator: this.room.collaudatore,
            }),
          });
          console.log(this.room);
        })
      )
      .subscribe(
        (res) => {
          this.configureSocket(this.roomId, this.userId);
          this.isLoading = false;
        },
        (err) => {
          this.navController.navigateBack(['/not-found']);
          this.isLoading = false;
        }
      );
  }

  ngAfterViewInit() {}

  // handles messages coming from signalling_server (remote party)
  public configureSocket(roomId: string, userId: string): void {
    this.socket.fromEvent<any>('message').subscribe(
      (msg) => {
        switch (msg.type) {
          case 'welcome':
            console.log('Welcome! ', msg.data);
            break;
          case 'info':
            console.log('Info: ', msg.data);
            break;
          case 'fatal':
            console.log('Fatal: ', msg.data);
            break;
          case `${this.roomId}`: //FREXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
            console.log('array per idroom: ', msg.data);
            console.log('Frontend lunghezza array: ' + msg.data.length);
            console.log('Frontend room: ' + msg.data[0]);
            console.log('Frontend idutente: ' + msg.data[1].idutente);
            console.log('Frontend stream: ' + msg.data[1].stream);
            break;
          default:
            console.log('unknown message: ', msg);
        }
      },
      (err) => console.log(err)
    );
    this.rtmpDestination = `${environment.urlRTMP}/${roomId}/${userId}`;
    this.flvOrigin = `${environment.urlWSS}/${roomId}/${userId}.flv`;
    this.socket.emit('config_rtmpDestination', this.rtmpDestination);
  }

  public isPlaying: boolean = false;
  public isStreaming: boolean = false;

  toggleStream() {
    if (this.isPlaying) {
      return;
    }
    if (this.isStreaming) {
      this.socket.emit('disconnectStream', '');
      this.playerComponent.stopStream();
      this.isStreaming = false;
    } else {
      this.socket.emit('start', 'start');
      this.playerComponent.startStream();
      this.isStreaming = true;
    }
  }

  togglePlay() {
    if (this.isStreaming) {
      return;
    }
    if (this.isPlaying) {
      this.isPlaying = false;
      this.playerComponent.stopPlayer();
    } else {
      this.isPlaying = true;
      this.playerComponent.startPlayer(this.flvOrigin);
    }
  }
}
