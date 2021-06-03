import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import FlvJs from 'flv.js';
import { Socket } from 'ngx-socket-io';
import { from, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const height = 120;
const width = 120;
const framerate = 15;
const audiobitrate = 44100;

@Component({
  selector: 'app-test-stream',
  templateUrl: './test-stream.page.html',
  styleUrls: ['./test-stream.page.scss'],
})
export class TestStreamPage implements OnInit, AfterViewInit, OnDestroy {
  private sub: Subscription;

  @ViewChild('local_video', { static: false }) localVideo: ElementRef;
  @ViewChild('output_video', { static: false }) remoteVideo: ElementRef;

  roomId: string = '';
  userId: string = '';
  rtmpDestination: string = '';
  flvOrigin: string = '';

  private localStream: MediaStream;
  private mediaRecorder: MediaRecorder;
  private constraints: MediaStreamConstraints;

  constructor(
    private socket: Socket,
    private activatedRouter: ActivatedRoute,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.activatedRouter.paramMap
      .pipe(
        switchMap((paramMap) => {
          if (!paramMap.has('roomId')) {
            this.navController.navigateBack(['/rooms']);
            return;
          }
          this.roomId = paramMap.get('roomId');
          return from(Plugins.Storage.get({ key: 'authData' }));
        }),
        map((storedData) => {
          if (!storedData || !storedData.value) {
            return null;
          }
          return JSON.parse(storedData.value).idutcas;
        })
      )
      .subscribe((userId) => {
        this.userId = userId;
        this.rtmpDestination = `${environment.urlRTMP}/${this.roomId}/${this.userId}`;
        this.flvOrigin = `${environment.urlWSS}/${this.roomId}/${this.userId}.flv`;
      });
  }

  ngAfterViewInit() {
    this.listaDispositivi();
    this.configureSocketMessageHandler();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe;
    }
  }

  // handles messages coming from signalling_server (remote party)
  private configureSocketMessageHandler(): void {
    this.socket.emit('config_rtmpDestination', this.rtmpDestination);

    this.socket.fromEvent<any>('message').subscribe(
      (msg) => {
        switch (msg.type) {
          case 'connect_timeout':
            console.log('state on connection timeout= ' + msg.data);
            break;
          case 'error':
            console.log('error: ' + msg.data);
            break;
          case 'connect_error':
            console.log('connection error= ' + msg.data);
            break;
          case 'fatal':
            console.log('fatal socket error! ' + msg.data);
            break;
          case 'disconnect':
            console.log('ERROR: server disconnected! ' + msg.data);
            break;
          case 'ffmpeg_stderr':
            console.log('fatal socket error!!', msg.data);
            break;
          case 'message':
            console.log('recv server message', msg.data);
            break;
          default:
            console.log('unknown message: ' + msg);
        }
      },
      (err) => console.log(err)
    );
  }

  private async requestGetUserMedia(devicePosition): Promise<void> {
    if (devicePosition == 'fronte') {
      this.constraints = {
        audio: { sampleRate: audiobitrate, echoCancellation: true },
        video: {
          width: { min: 100, ideal: width, max: 1920 },
          height: { min: 100, ideal: height, max: 1080 },
          frameRate: { ideal: framerate },
        },
      };
    } else if (devicePosition == 'retro') {
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

  async startStreming(devicePosition): Promise<void> {
    try {
      this.requestGetUserMedia(devicePosition).then((res) => {
        this.startLocalVideo();
        this.configureMediaRecorder();
        this.socket.emit('start', 'start');
      });
    } catch (err) {
      this.closeVideoCall();
    }
    return null;
  }

  stopStreaming(): void {
    this.socket.emit('hangup', '');
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
    this.socket.emit('disconnect', '');
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

  /************************* flvplayer *************************/

  idVarEglassesInFunction;
  idVarVideoZoomInFunction;

  player: FlvJs.Player;

  startFlvPlayer() {
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
        url: this.flvOrigin,
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

// Reference to the remote party
// private peerConnection: RTCPeerConnection;

// private handleHangupMessage(msg: Message) {
//   this.closeVideoCall();
// }

// private handleICECandidateMessage(data): void {
//   this.peerConnection.addIceCandidate(data).catch(this.reportError);
// }

// private reportError = (e: Error) => {
//   console.log('got error: ' + e.name);
//   console.log(e);
// };

// private handleOfferMessage(msg: RTCSessionDescription): void {
//   if (!this.peerConnection) {
//     this.createPeerConnection();
//   }
//   if (!this.localStream) {
//     this.startLocalVideo();
//   }
//   this.peerConnection
//     .setRemoteDescription(new RTCSessionDescription(msg))
//     .then(() => {
//       this.localVideo.nativeElement.srcObject = this.localStream;
//       this.localStream
//         .getTracks()
//         .forEach((track) =>
//           this.peerConnection.addTrack(track, this.localStream)
//         );
//     })
//     .then(() => {
//       return this.peerConnection.createAnswer();
//     })
//     .then((answer: RTCSessionDescription) => {
//       return this.peerConnection.setLocalDescription(answer);
//     })
//     .then(() => {
//       this.chatService.sendMessage({
//         type: 'answer',
//         data: this.peerConnection.localDescription,
//       });
//     })
//     .catch(this.handleGetUserMediaError);
// }

// handleGetUserMediaError(e: Error): void {
//   switch (e.name) {
//     case 'NotFoundError':
//       alert(
//         'unable to open your call because no  camera and/or microphone were found'
//       );
//       break;
//     case 'SecurityError':
//     case 'PermissionDeniedError':
//       break;
//     default:
//       console.log(e);
//       alert('error opening camera ' + e.message);
//       break;
//   }
//   this.closeVideoCall();
// }

// createPeerConnection() {
//   this.peerConnection = new RTCPeerConnection({
//     // iceServers per usare degli stun server pubblici ??
//     // per evitare network addredd translation issues????
//     iceServers: [{ urls: ['stun:stun.kundenserver.de:3478'] }],
//   });

//   this.peerConnection.onicecandidate = this.handleICECandidateEvent;
//   this.peerConnection.oniceconnectionstatechange =
//     this.handleICEConnectionStateChengeEvent;
//   this.peerConnection.onsignalingstatechange = this.handleSignalingStateEvent;
//   this.peerConnection.ontrack = this.handleTrackEvent;
// }

// private handleICECandidateEvent = (event: RTCPeerConnectionIceEvent) => {
//   if (event.candidate) {
//     this.chatService.sendMessage({
//       type: 'ice-candidate',
//       data: event.candidate,
//     });
//   }
// };

// private handleICEConnectionStateChengeEvent = (event: Event) => {
//   switch (this.peerConnection.iceConnectionState) {
//     case 'closed':
//     case 'failed':
//     case 'disconnected':
//       this.closeVideoCall();
//       break;
//   }
// };

// private handleSignalingStateEvent = (event: Event) => {
//   switch (this.peerConnection.iceConnectionState) {
//     case 'closed':
//       this.closeVideoCall();
//       break;
//   }
// };

// private handleTrackEvent = (event: RTCTrackEvent) => {
//   this.remoteVideo.nativeElement.srcObject = event.streams[0];
// };

/** stopStream() 
  stopStream() {
    console.log('stop pressed:');
    //stream.getTracks().forEach(track => track.stop())
    // ? this.mediaRecorder.stop();
    //recordingCircle.style.fill='gray';
    // ! button_stop.disabled = true;
    // ! button_start.disabled = true;
    // ! button_start_retrocam.disabled = true;
    // ! button_server.disabled = false;
    //Funzione per player flv.js (in pratica distrugge lo stream in NodeMediaServer)
    this.stopFlvStream();
  } */

/** funzioneplayer 
  funzioneplayer(valore, urlrtmp) {

    console.log(
      '🐱‍👤 : TestStreamPage : output_video',
      this.output_video.nativeElement.innerHTML
    );

    const words = urlrtmp.split('/');
    let startString = urlrtmp.search(words[3]);
    let suffissoUrlStream = urlrtmp.substring(startString, urlrtmp.length);
    let urlstream = 'wss://www.chop.click:8471/' + suffissoUrlStream + '.flv';

    // let secRefresh = 30;
    // switch (valore) {
    //   case 1: //dispositivo secondario via "ws o wss" (Cellulare via Websocket)
    //     //urlstream = 'wss://www.chop.click:8471/test/a.flv';
    //     if (this.idVarEglassesInFunction != '') {
    //       clearInterval(this.idVarEglassesInFunction);
    //     }
    //     this.idVarVideoZoomInFunction = setInterval(function () {
    //       this.flv_load_mds(urlstream);
    //     }, secRefresh * 1000); //Variabile per refresh; //Variabile per refresh

    //     break;
    // }

    if (valore == 1) {
      this.startFlvPlayer(urlstream);
    }

    return this.idVarEglassesInFunction;
  }
  */

/** requestMedia(devicePosition)
  requestMedia(devicePosition) {
    if (devicePosition == 'fronte') {
      this.constraints = {
        audio: { sampleRate: this.audiobitrate, echoCancellation: true },
        video: {
          width: { min: 100, ideal: this.width, max: 1920 },
          height: { min: 100, ideal: this.height, max: 1080 },
          frameRate: { ideal: this.framerate },
        },
      };
    } else if (devicePosition == 'retro') {
      this.constraints = {
        audio: { sampleRate: this.audiobitrate, echoCancellation: true },
        video: {
          width: { min: 100, ideal: this.width, max: 1920 },
          height: { min: 100, ideal: this.height, max: 1080 },
          frameRate: { ideal: this.framerate },
          facingMode: { exact: 'environment' },
        },
      };
    }

    navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then(function (stream) {
        //let supported = navigator.mediaDevices.getSupportedConstraints();
        //console.log(supported);
        this.video_show(stream); //only show locally, not remotely
        //recordingCircle.style.fill='red';
        this.socket.emit('config_rtmpDestination', this.suffix);
        this.socket.emit('start', 'start');

        // ? this.mediaRecorder = new MediaRecorder(stream);
        // ? this.mediaRecorder.start(250);

        // ! button_stop.disabled = false;
        // ! button_start.disabled = true;
        // ! button_start_retrocam.disabled = true;
        // ! button_server.disabled = true;

        //show remote stream
        // ! var livestream = document.getElementsByClassName('Livestream');
        // ! console.log('adding live stream');
        // ! livestream.innerHtml = 'test';

        // ? this.mediaRecorder.onstop = function (e) {
        // ?   console.log('stopped!');
        // ?   console.log(e);
        // ?   //stream.stop();
        // ? };

        // ? this.mediaRecorder.onpause = function (e) {
        // ?   console.log('media recorder paused!!');
        // ?   console.log(e);
        // ?   //stream.stop();
        // ? };

        // ? this.mediaRecorder.onerror = function (event) {
        // ?   let error = event.error;
        // ?   console.log('error', error.name);
        // ? };
        // ? //document.getElementById('button_start').disabled=false;

        // ! this.mediaRecorder.ondataavailable = function (e) {
        // !   console.log(e.data);
        // !   this.socket.emit('binarystream', e.data);
        // !   this.state = 'start';
        // !   //chunks.push(e.data);
        // ! };
      })
      .catch(function (err) {
        console.log('The following error occured: ' + err);
        // ! this.show_output('Local getUserMedia ERROR:' + err);
        //output_message.innerHTML="Local video source size is not support or No camera ?"+output_video.videoWidth+"x"+output_video.videoHeight;
        this.state = 'stop';
        // ! button_start.disabled=true;
        // ! button_start_retrocam.disabled=true;
        // ! button_server.disabled=false;
      });
      */

/** fail(str)
  fail(str) {
    alert(
      str +
        '\nUnable to access the camera Please ensure you are on HTTPS and using Firefox or Chrome.'
    );
  }
 */

/** 
  // @ViewChild('checkbox_Reconection', { static: false })
  // checkbox_Reconection: IonCheckbox;
  // @ViewChild('option_url', { static: false }) option_url: ElementRef;
  // @ViewChild('socketio_address', { static: false })
  // socketio_address: ElementRef;
  //var
  //output_console=document.getElementById('output_console'),
  //output_message=document.getElementById('output_message'),
  // ! output_video = document.getElementById("output_video"),
  // ! option_url = document.getElementById("option_url"),
  // ! socketio_address = document.getElementById("socket.io_address"),
  //option_width=document.getElementById('option_width'),
  //option_height=document.getElementById('option_height'),
  //option_framerate=document.getElementById('option_framerate'),
  //option_bitrate=document.getElementById('option_bitrate'),
  // ! button_start = document.getElementById("button_start"),
  // ! button_start_retrocam = document.getElementById("button_start_retrocam"),
  //height=parseInt(option_height.value),
  //width=parseInt(option_width.value),
  // framerate=parseInt(option_framerate.value),
  // audiobitrate = parseInt(option_bitrate.value),
  //url=option_url.value='rtmp://'+location.host.split(':')[0]+':1935/live/test0';
  // ! url = option_url.value;
  // ! console.log("aaa:" + option_url);
  // ! console.log("bbb" + url);
  // ! console.log("framerate", framerate);
  // option_height.onchange=option_height.onkeyup=function(){height=1*this.value;}
  // option_width.onchange=option_width.onkeyup=function(){width=1*this.value; console.log("width" +width);}
  // option_framerate.onchange=option_framerate.onkeyup=function(){framerate=1*this.value; console.log("framerate" 	+framerate);}
  // option_bitrate.onchange=option_bitrate.onkeyup=function(){audiobitrate=1*this.value; console.log("bitrate" 	+audiobitrate);}
  // ! option_url.onchange = option_url.onkeyup = function () {
  // !   url = this.value;
  // ! };
  // button_start.onclick=requestMedia;
  // button_start_retrocam.onclick=requestMediaRetro;
  // button_stop.onclick=stopStream;
  // ? btnstop() {
  // ?   this.stopStream();
  // ? }
  //button_server.onclick=connect_server;
  // ! var oo = document.getElementById("checkbox_Reconection");
  //just start the server
  //connect_server;
  // ! console.log("state initiated = " + state);
  // button_start.disabled=true;
  // button_start_retrocam.disabled=true; 
  // button_stop.disabled=true;
  // ! socket;
  // ? mediaRecorder: MediaRecorder;
    state = 'stop';
    t;
  */

/** showLocalVideo
  showLocalVideo(stream) {
    if ('srcObject' in this.output_video.nativeElement) {
      this.localVideo.nativeElement.muted = true;
      this.localVideo.nativeElement.srcObject = stream;
    } else {
      this.localVideo.nativeElement.src = window.URL.createObjectURL(stream);
    }
    // ? this.output_video.nativeElement.addEventListener(
    // ?   'loadedmetadata',
    // ?   function (e) {
    // ?     //console.log(output_video);
    // ?     //output_message.innerHTML="Local video source size:"+output_video.videoWidth+"x"+output_video.videoHeight ;
    // ?   },
    // ?   false
    // ? );
  }
  */

/** show_output(str) 
  show_output(str) {
    //output_console.value+="\n"+str;
    //output_console.scrollTop = output_console.scrollHeight;
  }
  */

/** timedCount()
  timedCount() {
    // ! var oo = document.getElementById("checkbox_Reconection");
    // this.oo = this.checkbox_Reconection.checked;
    if (this.checkbox_Reconection.checked) {
      console.log('timed count state = ' + this.state);
      if (this.state == 'ready') {
        console.log('reconnecting and restarting the media stream');
        //do I need to rerun the request media?

        this.connectServer();
        // ! button_start.disabled = false;
        // ! button_start_retrocam.disabled = false;
        // ! button_server.disabled = true;
      } else {
        console.log('not ready yet - wating 1000ms');
        this.t = setTimeout('timedCount()', 1000);
        this.connectServer();
        //output_message.innerHTML="try connect server ...";
        // ! button_start.disabled = true;
        // ! button_start_retrocam.disabled = true;
        // ! button_server.disabled = false;
      }
    } else {
      //reconnection is off
      console.log('reconnection is off, buttons change and we are done.');
      // ! button_start.disabled = true;
      // ! button_start_retrocam.disabled = true;
      // ! button_server.disabled = false;
    }
  }
 */

/**  connectServer()
  connectServer() {
    // navigator.getUserMedia = navigator.mediaDevices.getUserMedia;
    // ? || navigator.mediaDevices.mozGetUserMedia
    // ? || navigator.mediaDevices.msGetUserMedia
    // ? || navigator.mediaDevices.webkitGetUserMedia
    // if (!navigator.getUserMedia) {
    //   this.fail('No getUserMedia() available.');
    // }

    // ? if (!this.mediaRecorder) {
    // ?   this.fail('No MediaRecorder available.');
    // ? }

    // ! var socketOptions = {
    // !   secure: true,
    // !   reconnection: true,
    // !   reconnectionDelay: 1000,
    // !   timeout: 15000,
    // !   pingTimeout: 15000,
    // !   pingInterval: 45000,
    // !   query: {
    // !     framespersecond: this.framerate,
    // !     audioBitrate: this.audiobitrate,
    // !   },
    // ! };

    //start socket connection
    // ! this.socket = io.connect(
    // !   this.socketio_address.nativeElement.value,
    // !   socketOptions
    // ! );
    //console.log("ping interval =", socket.pingInterval, " ping TimeOut" = socket.pingTimeout);
    //output_message.innerHTML=socket;

    this.socket.on('connect_timeout', (timeout) => {
      console.log('state on connection timeout= ' + timeout);
      //output_message.innerHTML="Connection timed out";
      //recordingCircle.style.fill='gray';
    });
    this.socket.on('error', (error) => {
      console.log('state on connection error= ' + error);
      //output_message.innerHTML="Connection error";
      //recordingCircle.style.fill='gray';
    });

    this.socket.on('connect_error', function () {
      console.log('state on connection error= ' + this.state);
      //output_message.innerHTML="Connection Failed";
      //recordingCircle.style.fill='gray';
    });

    this.socket.on('message', function (m) {
      console.log('state on message= ' + this.state);
      console.log('recv server message', m);
      // ! this.show_output('SERVER:' + m);
    });

    this.socket.on('fatal', function (m) {
      // ! this.show_output('Fatal ERROR: unexpected:' + m);
      console.log('fatal socket error!!', m);
      console.log('state on fatal error = ' + this.state);
      //already stopped and inactive
      // this.recordingCircle.style.fill = 'gray';

      //mediaRecorder.start();
      //state="stop";
      //button_start.disabled=true;
      //button_server.disabled=false;
      //document.getElementById('button_start').disabled=true;
      //restart the server

      //should reload?
      // ? console.log('media recorder restarted');
      // ? if (this.checkbox_Reconection.checked) {
      // ?   //timedCount();
      // ?   //output_message.innerHTML="server is reload!";
      // ?   console.log('server is reloading!');
      // ?   //recordingCircle.style.fill='gray';
      // ? }
    });

    this.socket.on('ffmpeg_stderr', function (m) {
      //this is the ffmpeg output for each frame
      // ! this.show_output('FFMPEG:' + m);
    });

    this.socket.on('disconnect', function (reason) {
      console.log('state disconec= ' + this.state);
      // ! this.show_output('ERROR: server disconnected!');
      console.log('ERROR: server disconnected!' + reason);
      //recordingCircle.style.fill='gray';
      //reconnect the server
      this.connectServer();

      //socket.open();
      //mediaRecorder.stop();
      //state="stop";
      //button_start.disabled=true;
      //button_server.disabled=false;
      //	document.getElementById('button_start').disabled=true;
      //var oo=document.getElementById("checkbox_Reconection");
      // ? if (this.checkbox_Reconection.checked) {
      // ?   //timedCount();
      // ?   //output_message.innerHTML="server is reloading!";
      // ?   console.log('server is reloading!');
      // ? }
    });

    // this.state = 'ready';
    // console.log('state = ' + this.state);
    // button_start.disabled=false;
    // button_start_retrocam.disabled=false;
    // button_stop.disabled=false;
    // button_server.disabled=true;
    // output_message.innerHTML="connect server successful";
  }
 */
