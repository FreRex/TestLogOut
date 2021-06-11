import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StreamingService {
  flvOrigin: string = '';
  public isPlaying: boolean = false;
  private playRequestedSource = new Subject<string | null>();
  playRequested$ = this.playRequestedSource.asObservable();

  rtmpDestination: string = '';
  public isStreaming: boolean = false;
  private streamingRequestedSource = new Subject<string | null>();
  streamingRequested$ = this.streamingRequestedSource.asObservable();

  constructor(private socket: Socket) {}

  ngOnInit() {}

  // handles messages coming from signalling_server (remote party)
  public configureSocket(roomId: string, userId: string): void {
    this.rtmpDestination = `${environment.urlRTMP}/${roomId}/${userId}`;
    this.flvOrigin = `${environment.urlWSS}/${roomId}/${userId}.flv`;

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

  requestStartStreaming() {
    this.socket.emit('config_rtmpDestination', this.rtmpDestination);
    this.socket.emit('start', 'start');
    this.streamingRequestedSource.next(this.rtmpDestination);
    this.isStreaming = true;
  }

  requestStopStreaming() {
    this.socket.emit('disconnectStream', '');
    this.streamingRequestedSource.next(null);
    this.isStreaming = false;
  }

  requestToggleStreaming() {
    if (this.isStreaming) {
      this.requestStopStreaming();
    } else {
      this.requestStartStreaming();
    }
  }

  requestStartPlay() {
    this.playRequestedSource.next(this.flvOrigin);
    this.isPlaying = true;
  }

  requestStopPlay() {
    this.playRequestedSource.next(null);
    this.isPlaying = false;
  }

  requestTogglePlay() {
    if (this.isPlaying) {
      this.requestStopPlay();
    } else {
      this.requestStartPlay();
    }
  }
}
