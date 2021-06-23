import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ViewDidLeave } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { of, Subscription, timer } from 'rxjs';
import {
  delay,
  delayWhen,
  map,
  retryWhen,
  switchMap,
  tap,
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthService } from '../auth/auth.service';
import { Room, RoomService } from '../rooms/room.service';
import { ConferenceService, RoomUser } from './conference.service';
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
    private conferenceService: ConferenceService,
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
          this.configureSocket();
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
  public configureSocket(): void {
    this.socket.emit('first_idroom', this.roomId);

    this.socket
      .fromEvent<any>('lista_utenti')
      .pipe(
        switchMap((utentiInConference) => {
          console.log('🐱‍👤 : utentiInConference', utentiInConference);
          if (!utentiInConference) {
            if (this.userId.includes('guest')) {
              this.userId = `guest_${Math.floor(Math.random() * 2)}`;
            }
            return of(utentiInConference);
          }
          return of(utentiInConference.slice(1)).pipe(
            map((users) => {
              if (this.userId.includes('guest')) {
                // this.userId = `guest_${this.conferenceService.randomId(12)}`;
                this.userId = `guest_${Math.floor(Math.random() * 2)}`;
                console.log('🐱‍👤 : NEW userID', this.userId);
                for (let user of users) {
                  if (user['idutente'] == this.userId) {
                    throw this.userId;
                  }
                }
              }
              return this.userId;
            }),
            retryWhen((errors) =>
              errors.pipe(tap((u) => console.log(`User ${u} already exist!`)))
            ),
            tap((u) => {
              console.log(`Correct UserID: ${u}`);
            })
          );
        })
      )
      .subscribe(
        (res) => {
          console.log('🐱‍👤 : subscribe : res', res);
          this.rtmpDestination = `${environment.urlRTMP}/${this.roomId}/${this.userId}`;
          this.socket.emit('config_rtmpDestination', this.rtmpDestination);
        },
        (err) => {
          console.log('🐱‍👤 : subscribe : err', err);
        }
      );

    this.socket.fromEvent<any>('message').subscribe(
      (msg) => {
        switch (msg.type) {
          case 'welcome':
            console.log('Welcome! ', msg.data);
            break;
          // case 'lista_utenti':
          //   console.log(
          //     '🐱‍👤 : ConferencePage : lista_utenti',
          //     msg.data.slice(1)
          //   );
          //   // if (this.userId == 'guest') {
          //   //   // TODO
          //   //   // this.generateRandomUniqueId(msg.data.slice(1)).then(console.log);
          //   // }

          //   // if (this.userId == 'guest') {
          //   //   do {
          //   //     this.userId += '1';
          //   //     console.log(
          //   //       '🐱‍👤 : ConferencePage : newRandomId',
          //   //       this.userId
          //   //     );
          //   //   } while (this.idAlreadyExist(this.userId, msg.data.slice(1)));
          //   // }
          //   // this.rtmpDestination = `${environment.urlRTMP}/${this.roomId}/${this.userId}`;
          //   // this.socket.emit('config_rtmpDestination', this.rtmpDestination);
          //   break;
          case 'info':
            console.log('Info: ', msg.data);
            break;
          case 'fatal':
            console.log('Fatal: ', msg.data);
            break;
          case `${this.roomId}`: //FREXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
            console.log('array per idroom: ', msg.data);
            this.usersInRoom = [];
            for (const userData of msg.data.slice(1)) {
              let newUser = {
                idutente: userData['idutente'],
                nome: 'Nome Cognome', // TODO: recuperare nome da backend
                iniziali:
                  userData['idutente'].charAt(0) +
                  userData['socketid'].charAt(0),
                socketid: userData['socketid'],
                stream: userData['stream'], // TODO
              };
              if (newUser.stream) {
                // if (newUser.idutente != this.userId) {
                this.flvOrigin = `${environment.urlWSS}/${this.roomId}/${newUser.idutente}.flv`;
                if (!this.isPlaying && !this.isStreaming) {
                  this.isPlaying = true;
                  this.playerComponent.startPlayer(this.flvOrigin);
                }
                // }
                this.usersInRoom.unshift(newUser);
              } else {
                if (this.isPlaying && !this.isStreaming) {
                  this.isPlaying = false;
                  this.playerComponent.stopPlayer();
                }
                this.usersInRoom.push(newUser);
              }
            }
            break;
          case 'stopWebCam':
            console.log('stopWebCam: ', msg.data);
            if (msg.data == this.roomId) {
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
  }

  public isPlaying: boolean = false;
  public isStreaming: boolean = false;

  toggleStream() {
    if (this.isPlaying) {
      this.togglePlay();
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
      this.toggleStream;
    }
    if (this.isPlaying) {
      this.isPlaying = false;
      this.playerComponent.stopPlayer();
    } else {
      this.isPlaying = true;
      this.playerComponent.startPlayer(this.flvOrigin);
    }
  }

  async generateRandomUniqueId(usersArray: RoomUser[]): Promise<string> {
    let randomId = 'guest';
    do {
      randomId += '1';
      console.log('🐱‍👤 : ConferencePage : newRandomId', randomId);
    } while (
      () => {
        for (const user of usersArray) {
          console.log('🐱‍👤 : ConferencePage : user', user);
          return user.idutente == randomId;
        }
      }
    );
    return randomId;
  }
}
