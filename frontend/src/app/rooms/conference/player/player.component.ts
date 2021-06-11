import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import FlvJs from 'flv.js';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';

import { StreamingService } from '../streaming.service';

const height = 120;
const width = 120;
const framerate = 15;
const audiobitrate = 44100;

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, OnDestroy {
  private streamingSub: Subscription;
  private playerSub: Subscription;

  public loading = true;

  @ViewChild('local_video', { static: false }) localVideo: ElementRef;
  @Input() rtmpDestination: string = '';

  @ViewChild('output_video', { static: false }) remoteVideo: ElementRef;
  @Input() flvOrigin: string = '';

  private devicePosition: string = 'fronte';

  private localStream: MediaStream;
  private mediaRecorder: MediaRecorder;
  private constraints: MediaStreamConstraints;

  constructor(private socket: Socket, public streamingService: StreamingService) {}

  ngOnInit() {
    this.listaDispositivi();
    this.streamingSub = this.streamingService.streamingRequested$.subscribe((rtmpDestination) => {
      if (rtmpDestination !== null) {
        this.requestGetUserMedia().then((res) => {
          this.startLocalVideo();
          this.startMediaRecorder();
          this.loading = false;
          // this.socket.emit('start', 'start');
        });
      } else {
        this.stopLocalVideo();
        this.stopMediaRecorder();
        this.loading = true;
      }
    });
    this.playerSub = this.streamingService.playRequested$.subscribe((flvOrigin) => {
      if (flvOrigin !== null) {
        this.startFlvPlayer(flvOrigin);
        this.loading = false;
      } else {
        this.stopFlvPlayer();
        this.loading = true;
      }
    });
  }

  ngOnDestroy() {
    if (this.streamingSub) {
      this.streamingSub.unsubscribe();
    }
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
      console.log('🐱‍👤 : PlayerComponent : event.data', event.data);
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

  /************************* FlvPlayer *************************/

  idVarEglassesInFunction;
  idVarVideoZoomInFunction;

  player: FlvJs.Player;

  startFlvPlayer(flvOrigin: string) {
    if (typeof this.player !== 'undefined') {
      if (this.player != null) {
        this.player.unload();
        this.player.detachMediaElement();
        this.player.destroy();
        this.player = null;
      }
    }
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

  stopFlvPlayer() {
    if (this.player) {
      this.player.pause();
      this.player.unload();
      this.player.detachMediaElement();
      this.player.destroy();
      this.player = null;
    }
  }

  /************************* GetUserMedia *************************/

  private async requestGetUserMedia(): Promise<void> {
    if (this.devicePosition == 'fronte') {
      this.constraints = {
        audio: { sampleRate: audiobitrate, echoCancellation: true },
        video: {
          width: { min: 320, ideal: width, max: 1920 },
          height: { min: 180, ideal: height, max: 1080 },
          frameRate: { ideal: framerate },
        },
      };
    } else if (this.devicePosition == 'retro') {
      this.constraints = {
        audio: { sampleRate: audiobitrate, echoCancellation: true },
        video: {
          width: { min: 320, ideal: width, max: 1920 },
          height: { min: 180, ideal: height, max: 1080 },
          frameRate: { ideal: framerate },
          facingMode: { exact: 'environment' },
        },
      };
    }
    this.localStream = await navigator.mediaDevices.getUserMedia(this.constraints);
  }

  startLocalVideo(): void {
    this.localStream.getTracks().forEach((track) => {
      track.enabled = true;
    });
    this.localVideo.nativeElement.srcObject = this.localStream;
  }

  stopLocalVideo() {
    this.localStream.getTracks().forEach((track) => {
      track.enabled = false;
    });
    this.localVideo.nativeElement.srcObject = undefined;
  }

  /************************* RetroFrontCam *************************/

  checkRetroCam = false;

  async listaDispositivi() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log('enumerateDevices() not supported.');
      return;
    } else {
      // List cameras and microphones.
      await navigator.mediaDevices
        .enumerateDevices()
        .then(function (devices) {
          const videoDevices = devices.filter((device) => device.kind === 'videoinput');
          videoDevices.forEach(function (devices) {
            //Check retro cam
            if (
              devices.label.indexOf('facing back') > 0 ||
              /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
              )
            ) {
              this.checkRetroCam = true;
            }
          });
        })
        .catch(function (err) {
          console.log(err.name + ': ' + err.message);
        });
    }
    console.log('retroCam:' + this.checkRetroCam);
    return this.checkRetroCam;
  }
}
