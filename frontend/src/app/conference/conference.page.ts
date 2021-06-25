import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NavController,
  PopoverController,
  ToastController,
  ViewDidLeave,
} from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { iif, Observable, of, Subscription } from 'rxjs';
import { map, retryWhen, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthUser } from '../auth/auth-user.model';
import { AuthService } from '../auth/auth.service';
import { RoomItemService } from '../rooms/room-item.service';
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
    private roomItemService: RoomItemService,
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
          console.log('roomId', roomId);
          return this.roomService.selectRoom(+roomId);
          // return this.authService.currentUser$;
        }),
        switchMap((room: Room) => {
          if (!room) {
            throw new Error('Room Not Found');
          }
          this.room = room;
          console.log('this.room.id', this.room.id);
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
          console.log('this.user.idutcas', this.user.idutcas);
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

    // let userId = this.user.idutcas;
    this.socket
      .fromEvent<any>('lista_utenti')
      .pipe(
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
          console.log('this.user.idutcas', this.user.idutcas);
          console.log('this.user.nomecognome: ', this.user.nomecognome);
          this.rtmpDestination = `${environment.urlRTMP}/${this.room.id}/${this.user.idutcas}`;
          this.socket.emit('config_rtmpDestination', {
            rtmp: this.rtmpDestination,
            nome: this.user.nomecognome,
          });
        },
        (err) => {
          console.log('subscribe : err', err);
        }
      );

    this.socket
      .fromEvent<any>('stopWebCam')
      .pipe(
        map((data) => {
          if (data.numberRoom == this.room.id) {
            // if (data.idutcas !== this.user.idutcas) {
            if (this.isStreaming) {
              // this.socket.emit('disconnectStream', '');
              this.playerComponent.stopStream();
              this.isStreaming = false;
              // }
              this.flvOrigin = `${environment.urlWSS}/${this.room.id}/${data.idutcas}.flv`;
              if (!this.isPlaying) {
                this.playerComponent.startPlayer(this.flvOrigin);
                this.isPlaying = true;
              }
            }
          }
        })
      )
      .subscribe();

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
                // if (newUser.idutente != this.user.idutcas) {
                //   if (this.isStreaming) {
                //     this.playerComponent.stopStream();
                //     this.isStreaming = false;
                //   }
                // this.flvOrigin = `${environment.urlWSS}/${this.room.id}/${newUser.idutente}.flv`;
                //   if (!this.isPlaying) {
                //     this.playerComponent.startPlayer(this.flvOrigin);
                //     this.isPlaying = true;
                //   }
                // }
                this.usersInRoom.unshift(newUser);
              } else {
                // if (this.isPlaying) {
                //   this.playerComponent.stopPlayer();
                //   this.isPlaying = false;
                // }
                this.usersInRoom.push(newUser);
              }
            }
            break;
          case 'stopWebCam':
            console.log('stopWebCam: ', msg.data);
            // if (msg.data == this.room.id) {
            //   if (this.isStreaming) {
            //     // this.socket.emit('disconnectStream', '');
            //     this.playerComponent.stopStream();
            //     this.isStreaming = false;
            //   }
            // }
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
    // if (this.isPlaying) {
    //   this.togglePlay();
    // }
    if (this.isStreaming) {
      this.socket.emit('disconnectStream', '');
      this.playerComponent.stopStream();
      this.isStreaming = false;
    } else {
      this.socket.emit('start', { idutcas: this.user.idutcas });
      this.playerComponent.startStream();
      this.isStreaming = true;
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
      this.isPlaying = true;
      this.playerComponent.startPlayer(this.flvOrigin);
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
              console.log('🐱‍👤 : NEW userId:', userId);
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
    console.log('🐱‍👤 generateRandomId : result', result);
    return result;
  }
  copyLink() {
    this.roomItemService.copyLink(this.room);
  }
}
