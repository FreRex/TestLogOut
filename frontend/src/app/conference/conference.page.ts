import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { NavController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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
    private socket: Socket
  ) {}

  isLoading: boolean = false;
  ngOnInit() {
    this.isLoading = true;
    this.activatedRoute.queryParams
      .pipe(
        switchMap((params) => {
          console.log('🐱‍👤 : ConferencePage : paramMap', params);
          if (!params || !params['roomId']) {
            // if (!params.has('roomId')) {
            // this.navController.navigateBack(['/not-found']);
            // return;
            throw new Error('Missing ID');
          }
          this.roomId = params['roomId'];
          return from(Storage.get({ key: 'authData' }));
        }),
        switchMap((storedData) => {
          if (!storedData || !storedData.value) {
            throw new Error('Unauthenticated');
          }
          this.userId = JSON.parse(storedData.value).idutcas;
          return this.roomService.selectRoom(this.roomId);
          // return JSON.parse(storedData.value).idutcas;
        }),
        tap((room) => {
          if (!room) {
            throw new Error('Room Not Found');
          }
          this.room = room;
          console.log(this.room);
        })
      )
      .subscribe(
        (res) => {
          // this.userId = res;
          this.configureSocket(this.roomId, this.userId);
          console.log('🐱‍👤 : ConferencePage : this.userId', this.userId);
          console.log('🐱‍👤 : ConferencePage : this.roomId', this.roomId);
          this.isLoading = false;
        },
        (err) => {
          this.navController.navigateBack(['/not-found']);
          this.isLoading = false;
          console.log(err);
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
          /* case 'userInConference':
            console.log('userInConference: ', msg.data);
            break; */
          case `${this.roomId}`: //FREXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
            console.log('array per idroom: ', msg.data);
            console.log('Frontend lunghezza array: ' + msg.data.length);
            console.log('Frontend room: ' + msg.data[0]);
            console.log('Frontend idutente: ' + msg.data[1].idutente);
            console.log('Frontend stream: ' + msg.data[1].stream);
            break;
          default:
            console.log('unknown message: ', msg);
          // console.log('unknown message');
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
