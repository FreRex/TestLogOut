import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import FlvJs from 'flv.js';
import { Socket } from 'ngx-socket-io';
import { AuthUser } from 'src/app/auth/auth-user.model';
import { Room } from 'src/app/rooms/room.service';
import { AlertService } from 'src/app/shared/alert.service';
import { environment } from 'src/environments/environment';
import { PhotoModalComponent } from '../photo-modal/photo-modal.component';

const MIN_WIDTH = 320;
const MIN_HEIGHT = 180;

const IDEAL_WIDTH = 640;
const IDEAL_HEIGHT = 360;

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

const VIDEO_FRAMERATE = 15;
const AUDIO_BITRATE = 44100;

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  @ViewChild('localVideo', { static: false }) localVideo: ElementRef;
  @ViewChild('remoteVideo', { static: false }) remoteVideo: ElementRef;

  @Input() isStreaming: boolean = false;
  @Input() isPlaying: boolean = true;

  @Input() room: Room;
  @Input() user: AuthUser;

  // private devicePosition: string = 'fronte';

  private localStream: MediaStream;
  private mediaRecorder: MediaRecorder;
  private constraints: MediaStreamConstraints;

  constructor(
    private socket: Socket,
    private alertService: AlertService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.listaDispositivi().then((constraints: MediaStreamConstraints) => {
      this.constraints = constraints;
      // console.log('🐱‍👤 : this.constraints', this.constraints);
    });
  }

  capture() {
    this.modalController
      .create({
        component: PhotoModalComponent,
        cssClass: 'transparent-modal',
        backdropDismiss: false,
        componentProps: {
          WIDTH: this.localVideo.nativeElement.videoWidth,
          HEIGHT: this.localVideo.nativeElement.videoHeight,
          image: this.localVideo.nativeElement,
          room: this.room,
          user: this.user,
        },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      });
    // .then((res) => {
    //   if (res.role === 'ok') {
    //     this.presentToast(res.data['message'], 'secondary');
    //   } else if (res.role === 'error') {
    //     this.presentToast(
    //       `Aggiornamento fallito.\n${res.data['message']}`,
    //       'danger',
    //       5000
    //     );
    //   }
    // });
    // this.drawImageToCanvas(this.video.nativeElement);
    // this.captures.push(this.canvas.nativeElement.toDataURL('image/png'));
  }

  startStream() {
    // apre la camera dell'utente
    this.requestGetUserMedia()
      .then((res) => {
        this.startLocalVideo();
        this.startMediaRecorder();
      })
      .catch((err) => {
        this.alertService.presentAlert(
          err.toString(),
          `Concedi i permessi per usare la Fotocamera al sito e Ricarica la pagina <br>
          <img src="../../../assets/permessi.png" />`
        );
      });
  }

  stopStream() {
    // chiude la camera dell'utente
    this.stopLocalVideo();
    this.stopMediaRecorder();
  }

  /************************* FlvPlayer *************************/

  idVarEglassesInFunction;
  idVarVideoZoomInFunction;

  player: FlvJs.Player;
  startPlayer(roomId: number, streamId: string) {
    if (this.player) {
      this.stopPlayer();
    }
    let flvOrigin = `${environment.urlWSS}/${roomId}/${streamId}.flv`;
    this.player = FlvJs.createPlayer(
      {
        type: 'flv',
        url: flvOrigin,
      },
      {
        enableWorker: false,
        enableStashBuffer: false,
        stashInitialSize: 1,
        isLive: true,
        autoCleanupSourceBuffer: true,
      }
    );
    this.player.attachMediaElement(this.remoteVideo.nativeElement);
    this.player.load();
    this.player.play();
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

  /************************* GetUserMedia *************************/

  private async requestGetUserMedia(): Promise<void> {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia(
          this.constraints
        );
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
    this.localVideo.nativeElement.srcObject = this.localStream;
  }

  stopLocalVideo() {
    this.localStream.getTracks().forEach((track) => {
      track.stop(); // senza track.stop() non si chiude la telecamera
      track.enabled = false;
    });
    this.localVideo.nativeElement.srcObject = undefined;
    this.localStream = null;
  }

  /************************* MediaRecorder *************************/

  startMediaRecorder() {
    this.mediaRecorder = new MediaRecorder(this.localStream);

    this.mediaRecorder.onstop = (event: Event) => {
      console.log('media recorder stopped: ', event);
    };
    this.mediaRecorder.onstart = (event: Event) => {
      console.log('media recorder started: ', event);
    };
    this.mediaRecorder.onpause = (event: Event) => {
      console.log('media recorder paused: ', event);
    };
    this.mediaRecorder.onresume = (event: Event) => {
      console.log('media recorder resumed: ', event);
    };
    this.mediaRecorder.onerror = (event: MediaRecorderErrorEvent) => {
      console.log('error', event.error);
    };
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
      this.mediaRecorder.onstop = null;
      this.mediaRecorder.onstart = null;
      this.mediaRecorder.onpause = null;
      this.mediaRecorder.onresume = null;
      this.mediaRecorder.onerror = null;
      this.mediaRecorder.ondataavailable = null;
      this.mediaRecorder = null;
    }
  }

  /************************* RetroFrontCam *************************/

  // checkRetroCam = false;

  async listaDispositivi() {
    let constraints: MediaStreamConstraints;
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log('enumerateDevices() not supported.');
      return;
    } else {
      // List cameras and microphones.
      await navigator.mediaDevices
        .enumerateDevices()
        .then(function (devices) {
          const videoDevices = devices.filter(
            (device) => device.kind === 'videoinput'
          );
          videoDevices.forEach(function (devices) {
            //Check retro cam
            if (
              devices.label.indexOf('facing back') > 0 ||
              /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
              )
            ) {
              // this.checkRetroCam = true;
              constraints = {
                audio: { sampleRate: AUDIO_BITRATE, echoCancellation: true },
                video: {
                  width: { min: MIN_WIDTH, ideal: IDEAL_WIDTH, max: MAX_WIDTH },
                  height: {
                    min: MIN_HEIGHT,
                    ideal: IDEAL_HEIGHT,
                    max: MAX_HEIGHT,
                  },
                  frameRate: { ideal: VIDEO_FRAMERATE },
                  facingMode: { exact: 'environment' },
                },
              };
            } else {
              // this.checkRetroCam = false;
              constraints = {
                audio: { sampleRate: AUDIO_BITRATE, echoCancellation: true },
                video: {
                  width: { min: MIN_WIDTH, ideal: IDEAL_WIDTH, max: MAX_WIDTH },
                  height: {
                    min: MIN_HEIGHT,
                    ideal: IDEAL_HEIGHT,
                    max: MAX_HEIGHT,
                  },
                  frameRate: { ideal: VIDEO_FRAMERATE },
                  //facingMode: { exact: 'user' },
                },
              };
            }
          });
        })
        .catch(function (err) {
          console.log(err.name + ': ' + err.message);
        });
    }
    return constraints;
  }
}
