import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ViewDidLeave } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { from, of, Subscription, timer } from 'rxjs';
import { Storage } from '@capacitor/storage';

import {
  delay,
  delayWhen,
  map,
  retryWhen,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthUser } from '../auth/auth-user.model';

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
  public user: AuthUser;
  public usersInRoom: RoomUser[];

  // roomId: string = '';
  // userId: string = '';

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
          let roomId = paramMap.get('roomId');
          this.router.navigate([], {
            replaceUrl: true,
            relativeTo: this.activatedRoute,
          });
          console.log('🐱‍👤 : roomId', roomId);
          return this.roomService.selectRoom(+roomId);
          // return this.authService.currentUser$;
        }),
        switchMap((room: Room) => {
          if (!room) {
            throw new Error('Room Not Found');
          }
          this.room = room;
          console.log('🐱‍👤 : this.room.id', this.room.id);
          // this.userId = user.idutcas;
          // return this.roomService.selectRoom(+this.roomId);
          return this.authService.currentUser$;
          // return from(Storage.get({ key: 'authData' }));
        }),
        take(1)
      )
      .subscribe(
        (user: AuthUser) => {
          this.user = user;
          // this.userId = user.idutcas;
          console.log('🐱‍👤 : this.user.idutcas', this.user.idutcas);
          // this.room = room;
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
    this.socket.emit('first_idroom', this.room.id);

    let userId = this.user.idutcas;
    this.socket
      .fromEvent<any>('lista_utenti')
      .pipe(
        switchMap((utentiInConference) => {
          console.log('🐱‍👤 : utentiInConference:', utentiInConference);
          if (userId == 'guest') {
            if (!utentiInConference) {
              userId = `guest_${this.conferenceService.randomId(12)}`;
              // userId = `guest_${Math.floor(Math.random() * 3)}`;
              return of(userId);
            } else {
              return of(utentiInConference.slice(1)).pipe(
                map((users) => {
                  userId = `guest_${this.conferenceService.randomId(12)}`;
                  // userId = `guest_${Math.floor(Math.random() * 3)}`;
                  console.log('🐱‍👤 : NEW userId:', userId);
                  for (let user of users) {
                    if (user['idutente'] == userId) {
                      throw userId;
                    }
                  }
                  return userId;
                }),
                retryWhen((errors) =>
                  errors.pipe(
                    tap((id) => console.log(`User ${id} already exist!`))
                  )
                )
              );
            }
          } else {
            return of(this.user.idutcas);
          }
        }),
        tap((id) => {
          console.log('✔ : Correct ID:', id);
          if (id !== this.user.idutcas) {
            console.log('❓ : Should update user?', id !== this.user.idutcas);
            // TODO: potrei mandargli anche solo l'id e usare un osservabile come avevo fatto prima
            this.authService.updateGuest(
              new AuthUser(
                this.user.idutente,
                id,
                this.user.nomecognome,
                this.user.username,
                this.user.idcommessa,
                this.user.commessa,
                this.user.autorizzazione,
                this.user.token,
                this.user.tokenExpirationDate
              )
            );
          }
        })
      )
      .subscribe(
        (userId) => {
          console.log('🐱‍👤 : subscribe : res', userId);
          console.log('🐱‍👤 : this.user: ', this.user.nomecognome);
          this.rtmpDestination = `${environment.urlRTMP}/${this.room.id}/${userId}`;
          this.socket.emit('config_rtmpDestination', {
            rtmp: this.rtmpDestination,
            nome: this.user.nomecognome,
          });
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
          case 'info':
            console.log('Info: ', msg.data);
            break;
          case 'fatal':
            console.log('Fatal: ', msg.data);
            break;
          case `${this.room.id}`: //FREXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
            console.log('array per idroom: ', msg.data);
            this.usersInRoom = [];
            for (const userData of msg.data.slice(1)) {
              let newUser = {
                idutente: userData['idutente'],
                nomecognome: userData['nome'],
                iniziali:
                  userData['idutente'].charAt(0) +
                  userData['socketid'].charAt(0),
                socketid: userData['socketid'],
                stream: userData['stream'],
              };
              if (newUser.stream) {
                // if (newUser.idutente != this.userId) {
                this.flvOrigin = `${environment.urlWSS}/${this.room.id}/${newUser.idutente}.flv`;
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
