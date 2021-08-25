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

  // @Input() isStreaming: boolean = false;
  // @Input() isPlaying: boolean = true;

  @Input() room: Room;
  @Input() user: AuthUser;

  // private devicePosition: string = 'fronte';
  private constraints: MediaStreamConstraints;
  public cameraSide: string = 'front';

  constructor(
    private socket: Socket,
    private modalController: ModalController,
    public audioService: AudioRTCService,
    public streamingService: StreamingRtmpService,
    private gpsService: GpsService
  ) {}

  ngOnInit() {
    this.listaDispositivi() /* .then((constraints: MediaStreamConstraints) => {
      this.constraints = constraints;
      // console.log('🐱‍👤 : this.constraints', this.constraints);
    }) */;
  }

  ngOnDestroy() {
    console.log('🐱‍👤 : ngOnDestroy');
    if (this.streamingService.isStreaming) {
      this.socket.emit('disconnectStream', '');
      this.streamingService.stopStreaming();
      this.streamingService.isStreaming = false;
      this.user = null;
      this.gpsService.stopGps();
    }
    if (this.streamingService.isPlaying) {
      this.streamingService.isPlaying = false;
      this.streamingService.stopPlayer();
    }
    if (this.room) {
      this.audioService.leaveRoom(this.room.id);
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

  /************************* RetroFrontCam *************************/

  listaDispositivi() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log('enumerateDevices() not supported.');
      return;
    } else {
      // List cameras and microphones.
      navigator.mediaDevices
        .enumerateDevices()
        .then(function (devices) {
          const videoDevices = devices.filter(
            (device) => device.kind === 'videoinput'
          );
          videoDevices.forEach(function (devices) {
            console.log('🐱‍👤 : devices', devices);

            //Check retro cam
            if (
              devices.label.indexOf('facing back') > 0 ||
              /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
              )
            ) {
              this.cameraSide = 'back';
            } else {
              this.cameraSide = 'front';
            }
          });
        })
        .catch(function (err) {
          console.log(err.name + ': ' + err.message);
        });
    }
  }
}
