import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AudioRTCService } from './audiortc.service';
// import { WebRTCAdaptor } from '../../assets/js/webrtc_adaptor.js';

declare let WebRTCAdaptor: any;

@Component({
  selector: 'app-test-audiortc',
  templateUrl: './test-audiortc.page.html',
  styleUrls: ['./test-audiortc.page.scss'],
})
export class TestAudiortcPage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    public audioService: AudioRTCService
  ) {}

  private webRTCInstance: any;
  // pc_config = {
  //   iceServers: [
  //     {
  //       urls: 'stun:stun1.l.google.com:19302',
  //     },
  //   ],
  // };
  pc_config = null;
  sdpConstraints = {
    OfferToReceiveAudio: false,
    // OfferToReceiveVideo: false,
  };
  mediaConstraints = {
    // video: true,
    audio: true,
  };

  websocketURL = 'wss://www.eaglelive.tv:/WebRTCAppEE/websocket';
  roomName: string = this.route.snapshot.params.id;
  streamId: string = '';
  remoteStreams: any[] = [];

  token: string = '';
  // publishStreamId: string;
  isDataChannelOpen: boolean = false;
  isMicOn: boolean;

  ngOnInit() {
    let nome = Math.round(Math.random() * 100);
    let cognome = Math.round(Math.random() * 100);
    let usermobile = 'test1';
    this.streamId = nome + '-' + cognome;
    this.roomName = usermobile;

    this.audioService.createWebRTCInstance(this.roomName, this.streamId);
  }

  // toggleMic() {
  //   if (this.isMicOn) {
  //     this.webRTCInstance.unmuteLocalMic();
  //     this.isMicOn = true;
  //   } else {
  //     this.webRTCInstance.muteLocalMic();
  //     this.isMicOn = false;
  //   }
  // }

  // joinRoom() {
  //   this.webRTCInstance.joinRoom(this.roomName, this.streamId);
  // }

  // leaveRoom() {
  //   this.webRTCInstance.leaveFromRoom(this.roomName);
  //   this.webRTCInstance.muteLocalMic();
  //   // this.webRTCInstance.turnOffLocalCamera();
  // }

  // publish(streamId, token) {
  //   // this.publishStreamId = streamName;
  //   console.log('🐱‍👤 : streamId', streamId);
  //   this.webRTCInstance.publish(streamId, token);
  // }

  // streamInformation(obj) {
  //   console.log('🐱‍👤 : obj', obj);
  //   this.webRTCInstance.play(obj.streamId, this.token, this.roomName);
  // }

  // playVideo(obj) {
  //   const streamExists = this.remoteStreams.findIndex(
  //     (stream) => stream.id == obj.streamId
  //   );
  //   if (streamExists == -1) {
  //     this.remoteStreams.push({
  //       id: obj.streamId,
  //       stream: obj.stream,
  //     });
  //   }
  // }

  // removeRemoteVideo(streamId) {
  //   console.log('🐱‍👤 : streamId', streamId);
  //   const streamIndex = this.remoteStreams.findIndex(
  //     (stream) => stream.id == streamId
  //   );
  //   if (streamIndex !== -1) {
  //     this.remoteStreams.splice(streamIndex, 1);
  //   }
  // }

  // joinedTheRoom = false;
  // playOnly = true;
  // ngAfterViewInit(): void {
  //   this.webRTCInstance = new WebRTCAdaptor({
  //     websocket_url: this.websocketURL,
  //     mediaConstraints: this.mediaConstraints,
  //     peerconnection_config: this.pc_config,
  //     sdp_constraints: this.sdpConstraints,
  //     // localVideoId: 'localVideo',
  //     // isPlayMode: this.playOnly,
  //     debug: true,
  //     callback: (info, obj) => {
  //       if (info == 'initialized') {
  //         console.log('initialized');
  //       } else if (info == 'joinedTheRoom') {
  //         console.log('🐱‍👤 : obj', obj);
  //         console.log('🐱‍👤 : obj.streamId', obj.streamId);

  //         let roomOfStream = new Array();
  //         roomOfStream[obj.streamId] = obj.ATTR_ROOM_NAME;
  //         this.joinedTheRoom = true;
  //         console.log('joined the room: ' + roomOfStream[obj.streamId]);

  //         this.publish(obj.streamId, this.token);

  //         if (obj.streams != null) {
  //           obj.streams.forEach((item) => {
  //             this.webRTCInstance.play(item, this.token, this.roomName);
  //           });
  //         }
  //       } else if (info == 'streamJoined') {
  //         console.log('stream joined with id ' + obj.streamId);
  //         this.webRTCInstance.play(obj.streamId, this.token, this.roomName);
  //       } else if (info == 'newStreamAvailable') {
  //         this.playVideo(obj);
  //       } else if (info == 'streamLeaved') {
  //         console.log(' stream leaved with id ' + obj.streamId);
  //         this.removeRemoteVideo(obj.streamId);
  //       } else if (info == 'publish_started') {
  //         console.log('publish started to room: ' + this.roomName);
  //         // this.startAnimation();
  //       } else if (info == 'publish_finished') {
  //         console.log('publish finished');
  //       } else if (info == 'leavedFromRoom') {
  //         // var room = obj.ATTR_ROOM_NAME;
  //         console.log('🐱‍👤 : leavedFromRoom', obj);
  //         this.remoteStreams = [];
  //         this.joinedTheRoom = false;
  //       } else if (info == 'closed') {
  //         console.log('Connection closed ?');
  //         if (typeof obj != 'undefined') {
  //           console.log('Connecton closed: ' + JSON.stringify(obj));
  //         }
  //       } else if (info == 'play_finished') {
  //         console.log('play_finished');
  //       } else if (info == 'streamInformation') {
  //         this.streamInformation(obj);
  //       } else if (info == 'data_channel_opened') {
  //         console.log('Data Channel open for stream id', obj);
  //         this.isDataChannelOpen = true;
  //       } else if (info == 'data_channel_closed') {
  //         console.log('Data Channel closed for stream id', obj);
  //         this.isDataChannelOpen = false;
  //       } else if (info == 'data_received') {
  //         this.handleNotificationEvent(obj);
  //       }
  //     },
  //     callbackError: (error, message) => {
  //       //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
  //       var errorId;
  //       console.log('error callback: ' + JSON.stringify(error));
  //       var errorMessage = JSON.stringify(error);
  //       if (typeof message != 'undefined') {
  //         errorMessage = message;
  //         errorId = '0';
  //       }
  //       var errorMessage = JSON.stringify(error);
  //       if (error.indexOf('NotFoundError') != -1) {
  //         errorMessage =
  //           'Camera or Mic are not found or not allowed in your device.';
  //         errorId = '1';
  //       } else if (
  //         error.indexOf('NotReadableError') != -1 ||
  //         error.indexOf('TrackStartError') != -1
  //       ) {
  //         errorMessage =
  //           'Camera or Mic is being used by some other process that does not not allow these devices to be read.';
  //         errorId = '2';
  //       } else if (
  //         error.indexOf('OverconstrainedError') != -1 ||
  //         error.indexOf('ConstraintNotSatisfiedError') != -1
  //       ) {
  //         errorMessage =
  //           'There is no device found that fits your video and audio constraints. You may change video and audio constraints.';
  //         errorId = '3';
  //       } else if (
  //         error.indexOf('NotAllowedError') != -1 ||
  //         error.indexOf('PermissionDeniedError') != -1
  //       ) {
  //         errorMessage = 'You are not allowed to access camera and mic.';
  //         errorId = '4';
  //       } else if (error.indexOf('TypeError') != -1) {
  //         errorMessage = 'Video/Audio is required.';
  //         errorId = '5';
  //       } else if (error.indexOf('UnsecureContext') != -1) {
  //         errorMessage =
  //           'Fatal Error: Browser cannot access camera and mic because of unsecure context. Please install SSL and access via https';
  //         errorId = '6';
  //       } else if (error.indexOf('WebSocketNotSupported') != -1) {
  //         errorMessage = 'Fatal Error: WebSocket not supported in this browser';
  //         errorId = '7';
  //       } else if (error.indexOf('no_stream_exist') != -1) {
  //         //TODO: removeRemoteVideo(error.streamId);
  //         errorId = '8';
  //       } else if (error.indexOf('data_channel_error') != -1) {
  //         errorMessage = 'There was a error during data channel communication';
  //         errorId = '9';
  //       } else if (error.indexOf('already_publishing') != -1) {
  //         errorMessage = errorMessage;
  //         errorId = '10';
  //       } else if (error.indexOf('already_playing') != -1) {
  //         errorMessage = errorMessage;
  //         errorId = '11';
  //       } else if (error.indexOf('streamIdInUse') != -1) {
  //         errorMessage = errorMessage;
  //         errorId = '12';
  //       }
  //       // streamIdInUse
  //       if (errorId == 12) {
  //         alert('errorMessage: ' + errorMessage);
  //         alert('errorIdddd: ' + errorId);
  //       }
  //     },
  //   });
  // }

  // sendNotificationEvent(eventType) {
  //   if (this.isDataChannelOpen) {
  //     let notEvent = {
  //       streamId: this.streamId,
  //       eventType: eventType,
  //     };
  //     this.webRTCInstance.sendData(this.streamId, JSON.stringify(notEvent));
  //   }
  //   console.log(
  //     'Could not send the notification because data channel is not open.'
  //   );
  // }

  // handleNotificationEvent(obj) {
  //   console.log('Received data : ', obj.event.data);
  //   var notificationEvent = JSON.parse(obj.event.data);
  //   if (notificationEvent != null && typeof notificationEvent == 'object') {
  //     var eventStreamId = notificationEvent.streamId;
  //     var eventTyp = notificationEvent.eventType;

  //     if (eventTyp == 'MIC_MUTED') {
  //       console.log('Microphone muted for : ', eventStreamId);
  //     } else if (eventTyp == 'MIC_UNMUTED') {
  //       console.log('Microphone unmuted for : ', eventStreamId);
  //     }
  //   }
  // }

  // ngOnDestroy(): void {
  //   this.leaveRoom();
  // }

  // startAnimation() {
  //   let state = this.webRTCInstance.signallingState(this.publishStreamId);
  //   if (state != null && state != 'closed') {
  //     let iceState = this.webRTCInstance.iceConnectionState(
  //       this.publishStreamId
  //     );
  //     if (
  //       iceState != null &&
  //       iceState != 'failed' &&
  //       iceState != 'disconnected'
  //     ) {
  //       this.startAnimation();
  //     }
  //   }
  // }

  // updateCounter(newMessageEvent) {
  //   if (
  //     newMessageEvent.name !==
  //       JSON.parse(localStorage.getItem('userData')).firstname &&
  //     newMessageEvent.surname !==
  //       JSON.parse(localStorage.getItem('userData')).lastname
  //   ) {
  //     this.counterMessage = this.counterMessage + 1;
  //   }
  // }

  // printSelectedDeviceVideo(e) {
  //   this.webRTCInstance.switchVideoCameraCapture(this.streamId, e.target.value);
  //   this.selectedVideoInputID = e.target.value;
  // }

  // printSelectedDeviceAudioOutput(e) {
  //   this.videoTrainer.nativeElement.setSinkId(e.target.value);
  //   this.selectedAudioOutputID = e.target.value;
  // }

  // printSelectedDeviceAudioInput(e) {
  //   this.webRTCInstance.switchAudioInputSource(this.streamId, e.target.value);
  //   this.selectedAudioInputID = e.target.value;
  // }

  // checkNewDevice() {
  //   let videoInput: { id: string; label: string }[] = [];
  //   let audioInput: { id: string; label: string }[] = [];
  //   let audioOutput: { id: string; label: string }[] = [];
  //   navigator.mediaDevices.enumerateDevices().then((devices) => {
  //     devices = devices.filter((elm) => {
  //       switch (elm.kind) {
  //         case 'videoinput':
  //           videoInput.push({
  //             id: elm.deviceId,
  //             label: elm.label,
  //           });
  //           break;
  //         case 'audioinput':
  //           audioInput.push({
  //             id: elm.deviceId,
  //             label: elm.label,
  //           });
  //           break;
  //         case 'audiooutput':
  //           audioOutput.push({
  //             id: elm.deviceId,
  //             label: elm.label,
  //           });
  //           break;
  //       }
  //       this.videoInput = videoInput;
  //       this.audioInput = audioInput;
  //       this.audioOutput = audioOutput;
  //     });
  //   });
  // }

  // toggleCam() {
  //   if (this.isCamOn) {
  //     this.webRTCInstance.turnOnLocalCamera();
  //     this.isCamOn = !this.isCamOn;
  //   } else {
  //     this.webRTCInstance.turnOffLocalCamera();
  //     this.isCamOn = !this.isCamOn;
  //   }
  // }

  // toggleFullScreen(
  //   id1: HTMLElement,
  //   id2: HTMLElement,
  //   class1: string,
  //   class2: string,
  //   class3: string,
  //   class4: string
  // ) {
  //   if (!this.isFull) {
  //     id1.className = class1;
  //     id2.className = class2;
  //     this.isFull = !this.isFull;
  //   } else {
  //     id1.className = class3;
  //     id2.className = class4;
  //     this.isFull = !this.isFull;
  //   }
  // }

  // startScreenShare() {
  // this.webRTCInstance.switchDesktopCapture(this.publishStreamId);
  // //document.getElementById('startScreenShareButton').disabled = true;
  // }
}
