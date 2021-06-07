import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { NavController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { from, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.page.html',
  styleUrls: ['./conference.page.scss'],
})
export class ConferencePage implements OnInit, AfterViewInit {
  private sub: Subscription;

  roomId: string = '';
  userId: string = '';

  rtmpDestination: string = '';
  flvOrigin: string = '';

  isStreaming;

  constructor(
    private socket: Socket,
    private activatedRouter: ActivatedRoute,
    private navController: NavController
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.activatedRouter.paramMap
      .pipe(
        switchMap((paramMap) => {
          if (!paramMap.has('roomId')) {
            this.navController.navigateBack(['/rooms']);
            return;
          }
          this.roomId = paramMap.get('roomId');
          return from(Storage.get({ key: 'authData' }));
        }),
        map((storedData) => {
          if (!storedData || !storedData.value) {
            return null;
          }
          return JSON.parse(storedData.value).idutcas;
        })
      )
      .subscribe((userId) => {
        this.userId = userId;
        this.rtmpDestination = `${environment.urlRTMP}/${this.roomId}/${this.userId}`;
        this.flvOrigin = `${environment.urlWSS}/${this.roomId}/${this.userId}.flv`;
        this.configureSocket();
      });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe;
    }
  }

  // handles messages coming from signalling_server (remote party)
  private configureSocket(): void {
    this.socket.emit('config_rtmpDestination', this.rtmpDestination);

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
          case 'userInConference':
            console.log('userInConference: ', msg.data);
            break;
          default:
            console.log('unknown message: ', msg);
        }
      },
      (err) => console.log(err)
    );
  }
}
