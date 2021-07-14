import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { iif, Observable, of } from 'rxjs';
import { map, retryWhen, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthUser } from '../auth/auth-user.model';
import { AuthService } from '../auth/auth.service';
import { Room } from '../rooms/room.service';
import { Listener } from '../test-audiortc/audiortc.service';

export interface RoomUser {
  idutente: string;
  nome: string;
  // iniziali: string;
  // socketid: string;
  stream: boolean;
  audioStream?: Listener;
}

@Injectable({
  providedIn: 'root',
})
export class ConferenceService {
  public room: Room;
  public user: AuthUser;
  public usersInRoom: RoomUser[] = [];
  public streamingUser: RoomUser = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private socket: Socket
  ) {}

  // Observable string sources
  private startPublishSubject = new Subject<string>();
  private stopPublishSubject = new Subject<string>();
  private startPlaySubject = new Subject<string>();
  private stopPlaySubject = new Subject<string>();

  // Observable string streams
  startPublish$ = this.startPublishSubject.asObservable();
  stopPublish$ = this.stopPublishSubject.asObservable();
  startPlay$ = this.startPlaySubject.asObservable();
  stopPlay$ = this.stopPlaySubject.asObservable();

  // handles messages coming from signalling_server (remote party)
  public configureSocket(): void {
    this.socket.emit('first_idroom', this.room.id);

    // let userId = this.user.idutcas;
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
          // console.log('this.user.idutcas', this.user.idutcas);
          // console.log('this.user.nomecognome: ', this.user.nomecognome);

          this.socket.emit('config_rtmpDestination', {
            rtmp: `${environment.urlRTMP}/${this.room.id}/${this.user.idutcas}`,
            nome: this.user.nomecognome,
          });

          if (this.streamingUser && !this.isPlaying) {
            // this.playerComponent.startPlayer(
            //   this.room.id,
            //   this.streamingUser.idutente
            // );
            this.isPlaying = true;
          }
        },
        (err) => {
          console.log('subscribe : err', err);
        }
      );

    this.socket.fromEvent<any>('message').subscribe(
      (msg) => {
        switch (msg.type) {
          case 'welcome':
            // console.log('Welcome! ', msg.data);
            break;
          case 'info':
            // console.log('Info: ', msg.data);
            break;
          case 'fatal':
            // console.log('Fatal: ', msg.data);
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
            break;
          case 'stopWebCam': // TODO: cambiare in stopWebCam_${this.room.id}
            // if (msg.data == this.room.id) {
            if (this.isStreaming) {
              // this.socket.emit('disconnectStream', '');
              // this.playerComponent.stopStream();
              this.isStreaming = false;
            }
            // }
            break;
          case `startPlayer_${this.room.id}`: // TODO: cambiare in startPlayer_${this.room.id}
            //if (!this.isPlaying) {
            // this.playerComponent.startPlayer(
            //   this.room.id,
            //   this.streamingUser.idutente
            // );
            this.isPlaying = true;
            //}
            break;

          case `stopPlayer_${this.room.id}`:
            // console.log('🐱‍👤 : stopPlayer_', msg);
            if (this.isPlaying) {
              // this.playerComponent.stopPlayer();
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

  public isPlaying: boolean = false;
  public isStreaming: boolean = false;

  toggleStream() {
    if (this.isPlaying) {
      // this.playerComponent.stopPlayer(); // await stopPlayer.then(startStream....)
      this.isPlaying = false;
    }
    if (this.isStreaming) {
      this.socket.emit('disconnectStream', '');
      // this.playerComponent.stopStream();
      this.isStreaming = false;
      this.streamingUser = null;
    } else {
      this.socket.emit('start', { idutente: this.user.idutcas });
      // this.playerComponent.startStream();
      this.isStreaming = true;
    }
  }

  togglePlay() {
    // if (this.isStreaming) {
    //   this.toggleStream;
    // }
    if (this.isPlaying) {
      this.isPlaying = false;
      // this.playerComponent.stopPlayer();
    } else {
      if (this.room && this.streamingUser) {
        this.isPlaying = true;
        // this.playerComponent.startPlayer(
        //   this.room.id,
        //   this.streamingUser.idutente
        // );
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
