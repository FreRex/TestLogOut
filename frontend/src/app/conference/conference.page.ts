import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ViewDidLeave } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthService } from '../auth/auth.service';
import { Room, RoomService } from '../rooms/room.service';
import { RoomUser } from './conference.service';
import { PlayerComponent } from './player/player.component';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.page.html',
  styleUrls: ['./conference.page.scss'],
})
export class ConferencePage implements OnInit, OnDestroy, ViewDidLeave {
  private sub: Subscription;

  @ViewChild(PlayerComponent) private playerComponent: PlayerComponent;
  // currentRoom$: Observable<Room>;
  public room: Room;
  public usersInRoom: RoomUser[];

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
     * Recupera l'ID della room dall'URL,
     * l'utente corrente dall'authService,
     * i dati completi della room dal backend
     * e configura il socket per la room corrente
     */
    this.isLoading = true;
    this.sub = this.activatedRoute.paramMap
      .pipe(
        switchMap((paramMap) => {
          if (!paramMap.has('roomId')) {
            throw new Error('Missing Room ID');
          }
          this.roomId = paramMap.get('roomId');
          this.router.navigate([], {
            replaceUrl: true,
            relativeTo: this.activatedRoute,
          });
          console.log('🐱‍👤 : ConferencePage : this.roomId', this.roomId);
          return this.authService.currentUser$;
        }),
        switchMap((user) => {
          if (!user) {
            throw new Error('Unauthenticated');
          }
          this.userId = user.idutcas;
          console.log('🐱‍👤 : ConferencePage : this.userId', this.userId);
          return this.roomService.selectRoom(+this.roomId);
        })
      )
      .subscribe(
        (room: Room) => {
          this.room = room;
          this.configureSocket(this.roomId, this.userId);
          this.isLoading = false;
        },
        (err) => {
          this.navController.navigateBack(['/not-found']);
          this.isLoading = false;
        }
      );
  }

  ionViewDidLeave() {
    this.roomService.deselectRoom();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

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
            // for (let i = 1; i < msg.data.lenght; i++) {}
            // this.usersInRoom = msg.data.slice(1);
            this.usersInRoom = [];
            for (const userData of msg.data.slice(1)) {
              this.usersInRoom.push({
                idutente: userData['idutente'],
                iniziali:
                  userData['idutente'].charAt(0) +
                  userData['socketid'].charAt(0),
                socketid: userData['socketid'],
                // stream: userData['stream'], // TODO
                stream: true,
              });
            }
            break;
          case 'stopWebCam':
            console.log('stopWebCam: ', msg.data);
            if (msg.data == this.room.id) {
              if (this.isStreaming) {
                // this.socket.emit('disconnectStream', '');
                this.playerComponent.stopStream();
                this.isStreaming = false;
              }
            }
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
