import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { iif, Observable, of, Subscription } from 'rxjs';
import { map, retryWhen, switchMap, take, tap } from 'rxjs/operators';

import { AuthUser } from '../auth/auth-user.model';
import { AuthService } from '../auth/auth.service';
import { RoomFunctionsService } from '../rooms/room-list/room-functions.service';
import { Room, RoomService } from '../rooms/room.service';
import { AudioRTCService } from './audio-rtc.service';
import { ChatComponent } from './chat/chat.component';
import { RoomUser } from './room-user';
import { GpsService } from './gps.service';
import { MapComponent } from './map/map.component';
import { PlayerComponent } from './player/player.component';
import { StreamingRtmpService } from './streaming-rtmp.service';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.page.html',
  styleUrls: ['./conference.page.scss'],
})
export class ConferencePage implements OnInit, OnDestroy {
  private sub: Subscription;

  @ViewChild(PlayerComponent) private playerComponent: PlayerComponent;
  @ViewChild(MapComponent) private map: MapComponent;
  @ViewChild(ChatComponent) private chat: ChatComponent;

  public room: Room;
  public user: AuthUser;
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
    public platform: Platform,
    public roomFunctions: RoomFunctionsService,
    // public audioService: AudioRTCService,
    public streamingService: StreamingRtmpService,
    public gps: GpsService
  ) {}

  isLoading: boolean = false;
  isMapVisible: boolean = true;
  isVideoVisible: boolean = true;
  isMobile: boolean = false;
  isPartecipantVisible: boolean = true;
  isChatVisible: boolean = false;

  notificationCounter: number;

  public followOperatorOnMap: boolean = true;
  public marker2Delete: boolean = true;
  isInfo: boolean = false;

  nCounterHandler(count: number) {
    this.notificationCounter = count;
    console.log(count);
  }

  toggleMappa() {
    if (this.isMobile) {
      this.isVideoVisible = this.isMapVisible;
      this.isMapVisible = !this.isMapVisible;
    } else if (this.isVideoVisible) {
      this.isMapVisible = !this.isMapVisible;
    }
    if (this.isMapVisible) {
      this.map.updateSize();
    }
  }

  toggleVideo() {
    if (this.isMobile) {
      this.isMapVisible = this.isVideoVisible;
      this.isVideoVisible = !this.isVideoVisible;
    } else if (this.isMapVisible /* && !this.isStreaming && !this.isPlaying */) {
      this.isVideoVisible = !this.isVideoVisible;
      this.map.updateSize();
    }
  }

  toggleParticipant() {
    this.isPartecipantVisible = !this.isPartecipantVisible;
    this.isChatVisible = !this.isChatVisible;
  }

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
    this.isPartecipantVisible = !this.isPartecipantVisible;
    this.notificationCounter = 0;
    this.chat.notificationCounter = 0;
  }

  ngOnInit() {
    if (this.platform.is('mobile')) {
      this.isMobile = true;
      this.isMapVisible = false;
    }
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
          console.log('ttt');
          console.log(this.room.id);       
        },
        (err) => {
          this.navController.navigateBack(['/not-found']);
          this.isLoading = false;
        }
      );

    this.socket
      .fromEvent<any>('lista_utenti')           
      .pipe(
        tap((utentiInConference) => { console.log('Listautenti: ', utentiInConference)}),
        // tap((utentiInConference) => {
        //   if (utentiInConference) {
        //     utentiInConference.slice(1).forEach((user) => {
        //       if (user.stream == true) {
        // !         this.streamingUser = user;
        //       }
        //     });
        //   }
        // }),
        
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
          this.streamingService.configureSocket(this.user, this.room.id);
        },
        (err) => {
          console.log('subscribe : err', err);
        }
      );
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
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    // console.log('🐱‍👤 generateRandomId : result', result);
    return result;
  }
}
