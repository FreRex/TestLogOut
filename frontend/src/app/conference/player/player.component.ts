import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { take } from 'rxjs/operators';
import { AuthUser } from 'src/app/auth/auth-user.model';
import { Room } from 'src/app/rooms/room.service';
import { AlertService } from 'src/app/shared/alert.service';

import { AudioRTCService } from '../audio-rtc.service';
import { GpsService } from '../gps.service';
import { PhotoModalComponent } from '../photo-modal/photo-modal.component';
import { StreamingRtmpService } from '../streaming-rtmp.service';

// import FlvJs from 'flv.js';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo', { static: false }) localVideo: ElementRef;
  @ViewChild('remoteVideo', { static: false }) remoteVideo: ElementRef;
  @ViewChild('player', { static: false }) player: ElementRef;

  // @Input() isStreaming: boolean = false;
  // @Input() isPlaying: boolean = true;

  @Input() room: Room;
  @Input() user: AuthUser;

  // private devicePosition: string = 'fronte';
  // private constraints: MediaStreamConstraints;
  public cameraSide: string = 'front';

  constructor(
    private socket: Socket,
    private modalController: ModalController,
    private alertService: AlertService,
    public audioService: AudioRTCService,
    public streamService: StreamingRtmpService,
    private gpsService: GpsService
  ) {}

  ngOnInit() {
    screen.orientation.addEventListener('change', (orientation) => {
      console.log('🐱‍👤 : orientation', screen.orientation);
    });
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log('enumerateDevices() not supported.');
      return;
    }
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter(
          (device) => device.kind === 'videoinput'
        );
        videoDevices.forEach((device) => {
          console.log('🐱‍👤 : device', device);
          if (
            device.label.indexOf('facing back') > 0 ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            )
          ) {
            this.cameraSide = 'back';
          } else {
            this.cameraSide = 'front';
          }
        });
        // console.log('🐱‍👤 : this.cameraSide', this.cameraSide);
      })
      .catch(function (err) {
        console.log(err.name + ': ' + err.message);
      });
  }

  ngOnDestroy() {
    console.log('🐱‍👤 : ngOnDestroy');
    if (this.streamService.isStreaming) {
      this.socket.emit('disconnectStream', '');
      this.streamService.stopStreaming();
      this.streamService.isStreaming = false;
      this.user = null;
      this.gpsService.stopGps();
    }
    if (this.streamService.isPlaying) {
      this.streamService.isPlaying = false;
      this.streamService.stopPlayer();
    }
    if (this.room) {
      this.audioService.leaveRoom(this.room.id);
    }
  }

  isFullscreen: boolean = false;
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.player.nativeElement
        .requestFullscreen()
        .then((res) => {
          this.isFullscreen = true;
        })
        .catch((err) => {
          this.alertService.presentAlert(
            'Error attempting to enable full-screen mode:',
            `${err.message} (${err.name})`
          );
        });
    } else {
      document.exitFullscreen().then((res) => {
        this.isFullscreen = false;
      });
    }
  }

  capturePhoto(isLocal: boolean) {
    let video = isLocal
      ? this.localVideo.nativeElement
      : this.remoteVideo.nativeElement;

    console.log('🐱‍👤 : video', video);
    this.gpsService.coordinate$.pipe(take(1)).subscribe((coordinates) => {
      console.log('🐱‍👤 : coordinates', coordinates);
      this.modalController
        .create({
          component: PhotoModalComponent,
          cssClass: 'transparent-modal',
          backdropDismiss: false,
          componentProps: {
            WIDTH: video.videoWidth,
            HEIGHT: video.videoHeight,
            image: video,
            room: this.room,
            user: this.user,
            coordinates: coordinates,
          },
        })
        .then((modalEl) => {
          modalEl.present();
          return modalEl.onDidDismiss();
        });
    });
  }
}
