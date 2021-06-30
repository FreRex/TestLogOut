import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import FlvJs from 'flv.js';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

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
  @ViewChild('local_video', { static: false }) localVideo: ElementRef;
  @ViewChild('output_video', { static: false }) remoteVideo: ElementRef;

  @Input() isStreaming: boolean = false;
  @Input() isPlaying: boolean = true;

  private devicePosition: string = 'fronte';

  private localStream: MediaStream;
  private mediaRecorder: MediaRecorder;
  private constraints: MediaStreamConstraints;

  constructor(private socket: Socket) {}

  ngOnInit() {
    this.listaDispositivi();
  }

  startStream() {
    // apre la camera dell'utente
    this.requestGetUserMedia()
      .then((res) => {
        this.startLocalVideo();
        this.startMediaRecorder();
      })
      .catch((err) => {
        console.log(err);
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
      console.log('stop player')
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
        audio: { sampleRate: AUDIO_BITRATE, echoCancellation: true },
        video: {
          width: { min: MIN_WIDTH, ideal: IDEAL_WIDTH, max: MAX_WIDTH },
          height: { min: MIN_HEIGHT, ideal: IDEAL_HEIGHT, max: MAX_HEIGHT },
          frameRate: { ideal: VIDEO_FRAMERATE },
        },
      };
    } else if (this.devicePosition == 'retro') {
      this.constraints = {
        audio: { sampleRate: AUDIO_BITRATE, echoCancellation: true },
        video: {
          width: { min: MIN_WIDTH, ideal: IDEAL_WIDTH, max: MAX_WIDTH },
          height: { min: MIN_HEIGHT, ideal: IDEAL_HEIGHT, max: MAX_HEIGHT },
          frameRate: { ideal: VIDEO_FRAMERATE },
          facingMode: { exact: 'environment' },
        },
      };
    }
    this.localStream = await navigator.mediaDevices.getUserMedia(
      this.constraints
    );
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
