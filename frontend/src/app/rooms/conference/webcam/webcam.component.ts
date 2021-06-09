import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';

import { StreamingService } from '../streaming.service';

const height = 120;
const width = 120;
const framerate = 15;
const audiobitrate = 44100;

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss'],
})
export class WebcamComponent implements OnInit, OnDestroy {
  private sub: Subscription;

  @ViewChild('local_video', { static: false }) localVideo: ElementRef;
  @Input() rtmpDestination: string = '';

  private devicePosition: string;

  private localStream: MediaStream;
  private mediaRecorder: MediaRecorder;
  private constraints: MediaStreamConstraints;

  constructor(private socket: Socket, private streamingService: StreamingService) {}

  ngOnInit() {
    this.listaDispositivi();
    this.sub = this.streamingService.streamingRequested$.subscribe((rtmpDestination) => {
      if (rtmpDestination !== null) {
        this.startStreming();
      } else {
        this.stopStreaming();
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  private async requestGetUserMedia(): Promise<void> {
    if (this.devicePosition == 'fronte') {
      this.constraints = {
        audio: { sampleRate: audiobitrate, echoCancellation: true },
        video: {
          width: { min: 100, ideal: width, max: 1920 },
          height: { min: 100, ideal: height, max: 1080 },
          frameRate: { ideal: framerate },
        },
      };
    } else if (this.devicePosition == 'retro') {
      this.constraints = {
        audio: { sampleRate: audiobitrate, echoCancellation: true },
        video: {
          width: { min: 100, ideal: width, max: 1920 },
          height: { min: 100, ideal: height, max: 1080 },
          frameRate: { ideal: framerate },
          facingMode: { exact: 'environment' },
        },
      };
    }
    this.localStream = await navigator.mediaDevices.getUserMedia(this.constraints);
  }

  configureMediaRecorder() {
    this.mediaRecorder = new MediaRecorder(this.localStream);

    this.mediaRecorder.onstop = this.handleMediaRecorderOnStopEvent;
    this.mediaRecorder.onstart = this.handleMediaRecorderOnStartEvent;
    this.mediaRecorder.onpause = this.handleMediaRecorderOnPauseEvent;
    this.mediaRecorder.onresume = this.handleMediaRecorderOnResumeEvent;
    this.mediaRecorder.onerror = this.handleMediaRecorderOnErrorEvent;
    this.mediaRecorder.ondataavailable = this.handleMediaRecorderOnDataAvailableEvent;

    this.mediaRecorder.start(250);
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

  async startStreming(): Promise<void> {
    try {
      this.requestGetUserMedia().then((res) => {
        this.startLocalVideo();
        this.configureMediaRecorder();
        // this.socket.emit('start', 'start');
      });
    } catch (err) {
      this.closeVideoCall();
    }
    return null;
  }

  stopStreaming(): void {
    this.closeVideoCall();
  }

  private closeVideoCall(): void {
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
    this.stopLocalVideo();
    // this.socket.emit('disconnectStream', '');
  }

  handleMediaRecorderOnStopEvent = (event: Event) => {
    console.log('media recorder stopped: ', event);
  };
  handleMediaRecorderOnStartEvent = (event: Event) => {
    console.log('media recorder started: ', event);
  };
  handleMediaRecorderOnPauseEvent(event: Event) {
    console.log('media recorder paused: ', event);
  }
  handleMediaRecorderOnResumeEvent = (event: Event) => {
    console.log('media recorder resumed: ', event);
  };
  handleMediaRecorderOnErrorEvent = (event: MediaRecorderErrorEvent) => {
    console.log('error', event.error);
  };
  handleMediaRecorderOnDataAvailableEvent = (event: BlobEvent) => {
    console.log('🐱‍👤 : TestStreamPage : event.data', event.data);
    // this.socket.emit('message', {type: 'binarystream', data: event.data});
    this.socket.emit('binarystream', event.data);
  };

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
