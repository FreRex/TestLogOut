import { Injectable } from '@angular/core';
import mpegts from 'mpegts.js';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

import { AuthUser } from '../auth/auth-user.model';
import { AlertService } from '../shared/alert.service';
import { RoomUser } from './room-user';

const MIN_WIDTH = 320;
const MIN_HEIGHT = 180;

const IDEAL_WIDTH = 640;
const IDEAL_HEIGHT = 360;

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

const VIDEO_FRAMERATE = 30;
const AUDIO_BITRATE = 44100;

@Injectable({
  providedIn: 'root',
})
export class StreamingRtmpService {
  constructor(private socket: Socket, private alertService: AlertService) {}

  private localStream: MediaStream;
  private mediaRecorder: MediaRecorder;

  private localVideo: HTMLMediaElement;
  private remoteVideo: HTMLMediaElement;

  public isPlaying: boolean = false;
  public isStreaming: boolean = false;

  public streamingUser;
  private watchersSubject = new BehaviorSubject<RoomUser[]>([]);
  watchers$ = this.watchersSubject.asObservable();

  // handles messages coming from signalling_server (remote party)
  public configureSocket(localUser: AuthUser, roomId: number): void {
    this.localVideo = document.getElementById('localVideo') as HTMLMediaElement;
    this.remoteVideo = document.getElementById('remoteVideo') as HTMLMediaElement;

    this.socket.emit('config_rtmpDestination', {
      rtmp: `${environment.urlRTMP}/${roomId}/${localUser.idutcas}`,
      nome: localUser.nomecognome,
    });
    this.socket.fromEvent<any>('message').subscribe(
      (msg) => {
        switch (msg.type) {
          case 'welcome':
            break;
          case 'info':
            // console.log(msg.data) // da decommentare per controllare il Framerate
            break;
          case 'fatal':
            break;
          case `${roomId}`: //FREXXXXXXXXXXXXX
            let usersInRoom = [];
            msg.data.slice(1).forEach((user) => {
              if (user.stream) {
                this.streamingUser = user;
                usersInRoom.unshift(user);
              } else {
                usersInRoom.push(user);
              }
            });
            if (
              this.streamingUser &&
              this.streamingUser.idutente !== localUser.idutcas &&
              !this.isPlaying
            ) {
              this.startPlayer(roomId, this.streamingUser.idutente);
              this.isPlaying = true;
            }
            this.watchersSubject.next(usersInRoom);
            break;
          case 'stopWebCam': // TODO: cambiare in stopWebCam_${roomId}
            // if (msg.data == roomId) {
            if (this.isStreaming) {
              // this.socket.emit('disconnectStream', '');
              this.stopStreaming();
              this.isStreaming = false;
              // ! this.map.stopGps();
            }
            // }
            break;
          case `startPlayer_${roomId}`:
            //if (!this.isPlaying) {
            this.startPlayer(roomId, this.streamingUser.idutente);
            this.isPlaying = true;
            //}
            break;

          case `stopPlayer_${roomId}`:
            // console.log('🐱‍👤 : stopPlayer_', msg);
            if (this.isPlaying) {
              this.stopPlayer();
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

  toggleStreaming(idutcas: string, cameraSide: string) {
    if (this.isPlaying) {
      this.stopPlayer(); // await stopPlayer.then(startStream....)
      this.isPlaying = false;
    }
    if (this.isStreaming) {
      this.socket.emit('disconnectStream', '');
      this.stopStreaming();
      this.isStreaming = false;
      this.streamingUser = null;
      // ! this.map.stopGps();
    } else {
      this.socket.emit('start', { idutente: idutcas });
      this.startStreaming(cameraSide);
      this.isStreaming = true;
      // ! this.map.startGps();
    }
  }

  startStreaming(cameraSide: string) {
    // apre la camera dell'utente
    this.requestGetUserMedia(cameraSide)
      .then((res) => {
        this.startLocalVideo();
        this.startMediaRecorder();
      })
      .catch((err) => {
        console.log('🐱‍👤 : err', err);
        this.alertService.presentAlert(
          err.toString(),
          `Concedi i permessi per usare la Fotocamera al sito e Ricarica la pagina <br>
          <img src="../../../assets/permessi.png" />`
        );
      });
  }

  stopStreaming() {
    // chiude la camera dell'utente
    this.stopLocalVideo();
    this.stopMediaRecorder();
  }

  /************************* GetUserMedia *************************/

  private async requestGetUserMedia(cameraSide: string): Promise<void> {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { min: MIN_WIDTH, ideal: IDEAL_WIDTH, max: MAX_WIDTH },
            height: {
              min: MIN_HEIGHT,
              ideal: IDEAL_HEIGHT,
              max: MAX_HEIGHT,
            },
            frameRate: { ideal: VIDEO_FRAMERATE },
            facingMode: cameraSide === 'back' ? { exact: 'environment' } : null,
          },
        });
        if (!this.localStream) {
          throw new Error('You have no output video device');
        }
      } catch (e) {
        throw new Error(e);
      }
    }
  }

  startLocalVideo(): void {
    this.localStream.getTracks().forEach((track) => {
      track.enabled = true;
    });
    this.localVideo.srcObject = this.localStream;
  }

  stopLocalVideo() {
    this.localStream.getTracks().forEach((track) => {
      track.stop(); // senza track.stop() non si chiude la telecamera
      track.enabled = false;
    });
    this.localVideo.srcObject = undefined;
    this.localStream = null;
  }

  /************************* MediaRecorder *************************/

  startMediaRecorder() {
    this.mediaRecorder = new MediaRecorder(this.localStream);
    // this.mediaRecorder.onstop = (event: Event) => {
    //   console.log('media recorder stopped: ', event);
    // };
    // this.mediaRecorder.onstart = (event: Event) => {
    //   console.log('media recorder started: ', event);
    // };
    // this.mediaRecorder.onpause = (event: Event) => {
    //   console.log('media recorder paused: ', event);
    // };
    // this.mediaRecorder.onresume = (event: Event) => {
    //   console.log('media recorder resumed: ', event);
    // };
    // this.mediaRecorder.onerror = (event: MediaRecorderErrorEvent) => {
    //   console.log('error', event.error);
    // };
    this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
      // console.log('🐱‍👤 : PlayerComponent : event.data', event.data);
      // this.socket.emit('message', {type: 'binarystream', data: event.data});
      this.socket.emit('binarystream', event.data);
    };

    this.mediaRecorder.start(250);
  }

  stopMediaRecorder(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      // this.mediaRecorder.onstop = null;
      // this.mediaRecorder.onstart = null;
      // this.mediaRecorder.onpause = null;
      // this.mediaRecorder.onresume = null;
      // this.mediaRecorder.onerror = null;
      this.mediaRecorder.ondataavailable = null;
      this.mediaRecorder = null;
    }
  }

  /************************* FlvPlayer *************************/

  // https://github.com/xqq/mpegts.js
  // https://github.com/xqq/mpegts.js/blob/master/docs/livestream.md
  // https://github.com/xqq/mpegts.js/blob/master/docs/api.md#mpegtsmseplayer

  player: mpegts.Player;

  togglePlayer(roomId: number, idutente: string) {
    // if (this.streamingService.isStreaming) {
    //   this.toggleStream;
    // }
    if (this.isPlaying) {
      this.isPlaying = false;
      this.stopPlayer();
    } else {
      if (roomId && idutente) {
        this.isPlaying = true;
        this.startPlayer(roomId, idutente);
      } else {
        // TODO: gestire l'errore in modo visibile anche per l'utente
        // console.log('ERRORE: impossibile avviare il player');
      }
    }
  }

  startPlayer(roomId: number, streamId: string) {
    if (this.player) {
      this.stopPlayer();
    }
    if (mpegts.getFeatureList().mseLivePlayback) {
      let flvOrigin = `${environment.urlWSS}/${roomId}/${streamId}.flv`;
      this.player = mpegts.createPlayer(
        {
          type: 'flv',
          isLive: true,
          hasAudio: false,
          hasVideo: true,
          url: flvOrigin,
        },
        {
          enableWorker: false,
          enableStashBuffer: false,
          // stashInitialSize: 1,
          isLive: true,
          liveBufferLatencyChasing: true,
          liveBufferLatencyMaxLatency: 5.0,
          liveBufferLatencyMinRemain: 0.5,
          lazyLoad: true,
          lazyLoadMaxDuration: 3 * 60,
          lazyLoadRecoverDuration: 30,
          deferLoadAfterSourceOpen: true,
          autoCleanupSourceBuffer: true,
          autoCleanupMaxBackwardDuration: 3 * 60,
          autoCleanupMinBackwardDuration: 2 * 60,
        }
      );
      this.player.attachMediaElement(this.remoteVideo);
      this.player.load();
      this.player.play();
    } else {
      console.log('HTTP MPEG2-TS/FLV live stream cannot work on your browser');
    }
  }

  stopPlayer() {
    if (this.player) {
      console.log('stop player');
      this.player.pause();
      this.player.unload();
      this.player.detachMediaElement();
      this.player.destroy();
      this.player = null;
    }
  }
}
