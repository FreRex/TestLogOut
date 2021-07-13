import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare let WebRTCAdaptor: any;

@Injectable({
  providedIn: 'root',
})
export class AudioRTCService {
  constructor() {}
  private webRTCInstance: any;
  private websocketURL = 'wss://www.eaglelive.tv:/WebRTCAppEE/websocket';
  private token: string = '';
  private pc_config = null;
  // private pc_config = {
  //   iceServers: [{urls: 'stun:stun1.l.google.com:19302'}],
  // };
  private sdpConstraints = {
    OfferToReceiveAudio: false,
    // OfferToReceiveVideo: false,
  };
  private mediaConstraints = {
    // video: true,
    audio: true,
  };

  public remoteStreams: { id: string; stream: MediaStream }[] = [];
  public isDataChannelOpen: boolean = false;
  public isMicOn: boolean;
  public joinedTheRoom = false;

  public toggleMic() {
    if (this.isMicOn) {
      this.webRTCInstance.unmuteLocalMic();
      this.isMicOn = true;
    } else {
      this.webRTCInstance.muteLocalMic();
      this.isMicOn = false;
    }
  }

  public toggleAudio(roomName, streamId) {
    if (!this.joinedTheRoom) {
      this.webRTCInstance.joinRoom(roomName, streamId);
    } else {
      this.webRTCInstance.leaveFromRoom(roomName);
    }
  }

  public joinRoom(roomName, streamId) {
    this.webRTCInstance.joinRoom(roomName, streamId);
  }

  public leaveRoom(roomName) {
    this.webRTCInstance.leaveFromRoom(roomName);
    this.webRTCInstance.muteLocalMic();
    // this.webRTCInstance.turnOffLocalCamera();
  }

  publish(streamId, token) {
    // this.publishStreamId = streamName;
    console.log('🐱‍👤 : streamId', streamId);
    this.webRTCInstance.publish(streamId, token);
  }

  streamInformation(obj, roomName) {
    console.log('🐱‍👤 : obj', obj);
    this.webRTCInstance.play(obj.streamId, this.token, roomName);
  }

  addRemoteVideo(obj) {
    // const streamExists = this.remoteStreams.findIndex(
    //   (stream) => stream.id == obj.streamId
    // );
    // if (streamExists == -1) {
    // this.remoteStreams.push({
    //   id: obj.streamId,
    //   stream: obj.stream,
    // });
    // }

    if (
      this.remoteStreamsSubject
        .getValue()
        .findIndex((stream) => stream.id === obj.streamId) === -1
    ) {
      let array = this.remoteStreamsSubject.getValue().concat({
        id: obj.streamId,
        stream: obj.stream,
      });
      console.log('🐱‍👤 : array', array);
      this.remoteStreamsSubject.next(array);
    }
  }

  removeRemoteVideo(streamId) {
    console.log('🐱‍👤 : streamId', streamId);
    // const streamIndex = this.remoteStreams.findIndex(
    //   (stream) => stream.id == streamId
    // );
    // if (streamIndex !== -1) {
    //   this.remoteStreams.splice(streamIndex, 1);
    // }
    if (
      this.remoteStreamsSubject
        .getValue()
        .findIndex((stream) => stream.id == streamId) !== -1
    ) {
      this.remoteStreamsSubject.next(
        this.remoteStreamsSubject.getValue().filter((stream) => {
          stream.id !== streamId;
        })
      );
    }
  }

  private remoteStreamsSubject = new BehaviorSubject<
    { id: string; stream: MediaStream }[]
  >([]);
  remoteStreams$: Observable<{ id: string; stream: MediaStream }[]> =
    this.remoteStreamsSubject.asObservable();

  private userJoined = new BehaviorSubject<string>(null);
  userJoined$ = this.userJoined.asObservable();

  private userLeaved = new BehaviorSubject<string>(null);
  userLeaved$ = this.userLeaved.asObservable();

  private streamId: string;

  createWebRTCInstance(roomId, streamId): void {
    this.streamId = streamId;
    this.webRTCInstance = new WebRTCAdaptor({
      websocket_url: this.websocketURL,
      mediaConstraints: this.mediaConstraints,
      peerconnection_config: this.pc_config,
      sdp_constraints: this.sdpConstraints,
      // localVideoId: 'localVideo',
      // isPlayMode: this.playOnly,
      debug: true,
      callback: (info, obj) => {
        if (info == 'initialized') {
          console.log('initialized');
        } else if (info == 'joinedTheRoom') {
          console.log('🐱‍👤 : joinedTheRoom', obj);
          // let roomOfStream = new Array();
          // roomOfStream[obj.streamId] = obj.ATTR_ROOM_NAME;
          this.joinedTheRoom = true;
          this.userJoined.next(obj.streamId);
          this.publish(obj.streamId, this.token);
          if (obj.streams.length) {
            obj.streams.forEach((item) => {
              console.log('🐱‍👤 : item', item);
              this.userJoined.next(item);
              this.webRTCInstance.play(item, this.token, roomId);
            });
          }
        } else if (info == 'leavedFromRoom') {
          console.log('🐱‍👤 : leavedFromRoom', obj);
          this.userLeaved.next(this.streamId);
          this.remoteStreams = [];
          this.joinedTheRoom = false;
        } else if (info == 'streamJoined') {
          console.log('🐱‍👤 : streamJoined', obj);
          this.webRTCInstance.play(obj.streamId, this.token, roomId);
        } else if (info == 'newStreamAvailable') {
          console.log('🐱‍👤 : newStreamAvailable', obj);
          this.userJoined.next(obj.streamId);
          // this.addRemoteVideo(obj);
        } else if (info == 'streamLeaved') {
          console.log('🐱‍👤 : streamLeaved', obj);
          this.userLeaved.next(obj.streamId);
          // this.removeRemoteVideo(obj.streamId);
        } else if (info == 'publish_started') {
          console.log('🐱‍👤 : publish_started', obj);
        } else if (info == 'publish_finished') {
          console.log('🐱‍👤 : publish_finished', obj);
        } /* else if (info == 'closed') {
          console.log('Connection closed ?');
          if (typeof obj != 'undefined') {
            console.log('Connecton closed: ' + JSON.stringify(obj));
          }
        } */ /*  else if (info == 'play_finished') {
          console.log('play_finished');
        } */ /* else if (info == 'streamInformation') {
          console.log('🐱‍👤 : streamInformation', obj);
          this.streamInformation(obj, roomName);
        } */ /* else if (info == 'data_channel_opened') {
          console.log('Data Channel open for stream id', obj);
          this.isDataChannelOpen = true;
        } else if (info == 'data_channel_closed') {
          console.log('Data Channel closed for stream id', obj);
          this.isDataChannelOpen = false;
        } */ else if (info == 'data_received') {
          console.log('🐱‍👤 : data_received', obj);
          this.handleNotificationEvent(obj);
        }
      },
      callbackError: (error, message) => {
        //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
        var errorId;
        console.log('error callback: ' + JSON.stringify(error));
        var errorMessage = JSON.stringify(error);
        if (typeof message != 'undefined') {
          errorMessage = message;
          errorId = '0';
        }
        var errorMessage = JSON.stringify(error);
        if (error.indexOf('NotFoundError') != -1) {
          errorMessage =
            'Camera or Mic are not found or not allowed in your device.';
          errorId = '1';
        } else if (
          error.indexOf('NotReadableError') != -1 ||
          error.indexOf('TrackStartError') != -1
        ) {
          errorMessage =
            'Camera or Mic is being used by some other process that does not not allow these devices to be read.';
          errorId = '2';
        } else if (
          error.indexOf('OverconstrainedError') != -1 ||
          error.indexOf('ConstraintNotSatisfiedError') != -1
        ) {
          errorMessage =
            'There is no device found that fits your video and audio constraints. You may change video and audio constraints.';
          errorId = '3';
        } else if (
          error.indexOf('NotAllowedError') != -1 ||
          error.indexOf('PermissionDeniedError') != -1
        ) {
          errorMessage = 'You are not allowed to access camera and mic.';
          errorId = '4';
        } else if (error.indexOf('TypeError') != -1) {
          errorMessage = 'Video/Audio is required.';
          errorId = '5';
        } else if (error.indexOf('UnsecureContext') != -1) {
          errorMessage =
            'Fatal Error: Browser cannot access camera and mic because of unsecure context. Please install SSL and access via https';
          errorId = '6';
        } else if (error.indexOf('WebSocketNotSupported') != -1) {
          errorMessage = 'Fatal Error: WebSocket not supported in this browser';
          errorId = '7';
        } else if (error.indexOf('no_stream_exist') != -1) {
          //TODO: removeRemoteVideo(error.streamId);
          errorId = '8';
        } else if (error.indexOf('data_channel_error') != -1) {
          errorMessage = 'There was a error during data channel communication';
          errorId = '9';
        } else if (error.indexOf('already_publishing') != -1) {
          errorMessage = errorMessage;
          errorId = '10';
        } else if (error.indexOf('already_playing') != -1) {
          errorMessage = errorMessage;
          errorId = '11';
        } else if (error.indexOf('streamIdInUse') != -1) {
          errorMessage = errorMessage;
          errorId = '12';
        }
        // streamIdInUse
        if (errorId == 12) {
          alert('errorMessage: ' + errorMessage);
          alert('errorIdddd: ' + errorId);
        }
      },
    });
  }

  handleNotificationEvent(obj) {
    console.log('Received data : ', obj.event.data);
    var notificationEvent = JSON.parse(obj.event.data);
    if (notificationEvent != null && typeof notificationEvent == 'object') {
      var eventStreamId = notificationEvent.streamId;
      var eventTyp = notificationEvent.eventType;

      if (eventTyp == 'MIC_MUTED') {
        console.log('Microphone muted for : ', eventStreamId);
      } else if (eventTyp == 'MIC_UNMUTED') {
        console.log('Microphone unmuted for : ', eventStreamId);
      }
    }
  }

  // sendNotificationEvent(eventType, streamId) {
  //   if (this.isDataChannelOpen) {
  //     let notEvent = {
  //       streamId: streamId,
  //       eventType: eventType,
  //     };
  //     this.webRTCInstance.sendData(streamId, JSON.stringify(notEvent));
  //   }
  //   console.log(
  //     'Could not send the notification because data channel is not open.'
  //   );
  // }

  // TODO: implementarlo su conference page?
  // ngOnDestroy(): void {
  //   this.leaveRoom();
  // }
}
