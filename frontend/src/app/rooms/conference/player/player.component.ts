import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import FlvJs from 'flv.js';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  @ViewChild('output_video', { static: false }) remoteVideo: ElementRef;

  @Input() flvOrigin: string = '';

  constructor() {}

  ngOnInit() {}

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
}
