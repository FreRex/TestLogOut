import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ViewWillLeave } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, iif, Observable, of, Subscription } from 'rxjs';
import { map, retryWhen, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthUser } from '../auth/auth-user.model';
import { AuthService } from '../auth/auth.service';
import { RoomFunctionsService } from '../rooms/room-list/room-functions.service';
import { Room, RoomService } from '../rooms/room.service';
import { AudioRTCService } from './audiortc.service';
import { RoomUser } from './conference.service';
import { GpsService } from './gps.service';
import { PlayerComponent } from './player/player.component';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.page.html',
  styleUrls: ['./conference.page.scss'],
})
export class ConferencePage implements OnInit, OnDestroy, ViewWillLeave {
  private sub: Subscription;

  @ViewChild(PlayerComponent) private playerComponent: PlayerComponent;
  @ViewChild(MapComponent) private map: MapComponent;
  public room: Room;
  public user: AuthUser;
  public usersInRoom: RoomUser[] = [];
  public streamingUser: RoomUser = null;

  // roomId: string = '';
  // userId: string = '';

  // flvOrigin: string = '';
  // rtmpDestination: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private roomService: RoomService,
    private authService: AuthService,
    private socket: Socket,
    private router: Router,
    public roomFunctions: RoomFunctionsService,
    public audioService: AudioRTCService,
    public gps: GpsService
  ) {}

  isLoading: boolean = false;
  public followOperatorOnMap: boolean = true;
  public marker2Delete: boolean = true;
  isInfo: boolean = false;

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
          let roomId = paramMap.get('roomId');
          this.router.navigate([], {
            replaceUrl: true,
            relativeTo: this.activatedRoute,
          });
          return this.roomService.selectRoom(+roomId);
        }),
        switchMap((room: Room) => {
          if (!room) {
            throw new Error('Room Not Found');
          }
          this.room = room;
          return this.authService.currentUser$;
        }),
        take(1)
      )
      .subscribe(
        (user: AuthUser) => {
          this.user = user;
          this.socket.emit('first_idroom', this.room.id);
          this.isLoading = false;
        },
        (err) => {
          this.navController.navigateBack(['/not-found']);
          this.isLoading = false;
        }
      );

    this.socket
      .fromEvent<any>('lista_utenti')
      .pipe(
        tap((utentiInConference) => {
          if (utentiInConference) {
            utentiInConference.slice(1).forEach((user) => {
              if (user.stream == true) {
                this.streamingUser = user;
              }
            });
          }
        }),
        switchMap((utentiInConference) =>
          iif(
            () => this.user.idutcas !== 'guest',
            of(this.user.idutcas),
            this.checkIdGuest(utentiInConference, this.user.idutcas)
          )
        ),
        switchMap((userId: string) =>
          iif(
            () => userId !== this.user.idutcas,
            this.authService.updateGuest(userId),
            of(this.user)
          )
        )
      )
      .subscribe(
        (user: AuthUser) => {
          this.user = user;
          this.configureSocket();
          if (this.streamingUser && !this.isPlaying) {
            this.playerComponent.startPlayer(
              this.room.id,
              this.streamingUser.idutente
            );
            this.isPlaying = true;
          }
        },
        (err) => {
          console.log('subscribe : err', err);
        }
      );
  }

  ionViewWillLeave() {
    if (this.isStreaming) {
      this.socket.emit('disconnectStream', '');
      this.playerComponent.stopStream();
      this.isStreaming = false;
      this.streamingUser = null;
      this.gps.stopGps();
    }
    if (this.isPlaying) {
      this.isPlaying = false;
      this.playerComponent.stopPlayer();
    }
    this.audioService.leaveRoom(this.room.id);
  }

  goBack() {
    this.roomService.deselectRoom();
    this.navController.navigateBack(['/rooms']);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  followOperator() {
    this.followOperatorOnMap = !this.followOperatorOnMap;
  }

  showDisplayInfo() {
    this.isInfo = !this.isInfo;
  }

  private watchersSubject = new BehaviorSubject<RoomUser[]>([]);
  watchers$ = this.watchersSubject.asObservable();

  // handles messages coming from signalling_server (remote party)
  public configureSocket(): void {
    this.socket.emit('config_rtmpDestination', {
      rtmp: `${environment.urlRTMP}/${this.room.id}/${this.user.idutcas}`,
      nome: this.user.nomecognome,
    });
    this.socket.fromEvent<any>('message').subscribe(
      (msg) => {
        switch (msg.type) {
          case 'welcome':
            break;
          case 'info':
            break;
          case 'fatal':
            break;
          case `${this.room.id}`: //FREXXXXXXXXXXXXX
            console.log('array per idroom: ', msg);
            this.usersInRoom = [];
            msg.data.slice(1).forEach((user) => {
              if (user.stream) {
                this.streamingUser = user;
                this.usersInRoom.unshift(user);
              } else {
                this.usersInRoom.push(user);
              }
            });
            this.watchersSubject.next(this.usersInRoom);
            break;
          case 'stopWebCam': // TODO: cambiare in stopWebCam_${this.room.id}
            // if (msg.data == this.room.id) {
            if (this.isStreaming) {
              // this.socket.emit('disconnectStream', '');
              this.playerComponent.stopStream();
              this.isStreaming = false;
              this.map.stopGps();
            }
            // }
            break;
          case `startPlayer_${this.room.id}`: // TODO: cambiare in startPlayer_${this.room.id}
            //if (!this.isPlaying) {
            this.playerComponent.startPlayer(
              this.room.id,
              this.streamingUser.idutente
            );
            this.isPlaying = true;
            //}
            break;

          case `stopPlayer_${this.room.id}`:
            // console.log('🐱‍👤 : stopPlayer_', msg);
            if (this.isPlaying) {
              this.playerComponent.stopPlayer();
              this.isPlaying = false;
              this.streamingUser = null;
            }
            break;
          default:
            console.log('unknown message: ', msg);
        }
      },
      (err) => console.log(err)
    );
  }

  capturePhoto() {
    if (this.isStreaming) {
      this.playerComponent.capture(true);
    } else {
      this.playerComponent.capture(false);
    }
  }

  public isPlaying: boolean = false;
  public isStreaming: boolean = false;

  toggleStream() {
    if (this.isPlaying) {
      this.playerComponent.stopPlayer(); // await stopPlayer.then(startStream....)
      this.isPlaying = false;
    }
    if (this.isStreaming) {
      this.socket.emit('disconnectStream', '');
      this.playerComponent.stopStream();
      this.isStreaming = false;
      this.streamingUser = null;
      this.map.stopGps();
    } else {
      this.socket.emit('start', { idutente: this.user.idutcas });
      this.playerComponent.startStream();
      this.isStreaming = true;
      this.map.startGps();
    }
  }

  togglePlay() {
    // if (this.isStreaming) {
    //   this.toggleStream;
    // }
    if (this.isPlaying) {
      this.isPlaying = false;
      this.playerComponent.stopPlayer();
    } else {
      if (this.room && this.streamingUser) {
        this.isPlaying = true;
        this.playerComponent.startPlayer(
          this.room.id,
          this.streamingUser.idutente
        );
      } else {
        // TODO: gestire l'errore in modo visibile anche per l'utente
        // console.log('ERRORE: impossibile avviare il player');
      }
    }
  }

  checkIdGuest(utentiInConference: any, userId: string): Observable<string> {
    return of(utentiInConference).pipe(
      switchMap((utentiInConference) => {
        if (!utentiInConference) {
          userId = `guest_${this.generateRandomId(12)}`;
          // userId = `guest_${Math.floor(Math.random() * 3)}`;
          return of(userId);
        } else {
          return of(utentiInConference.slice(1)).pipe(
            map((users) => {
              userId = `guest_${this.generateRandomId(12)}`;
              // userId = `guest_${Math.floor(Math.random() * 3)}`;
              // console.log('🐱‍👤 : NEW userId:', userId);
              for (let user of users) {
                if (user['idutente'] == userId) {
                  throw userId;
                }
              }
              return userId;
            }),
            retryWhen((errors) =>
              errors.pipe(tap((id) => console.log(`User ${id} already exist!`)))
            )
          );
        }
      })
    );
  }

  generateRandomId(length: number): string {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    // console.log('🐱‍👤 generateRandomId : result', result);
    return result;
  }
}
