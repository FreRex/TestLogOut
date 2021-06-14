import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { StreamingService } from '../streaming.service';

@Component({
  selector: 'app-streaming-bar',
  templateUrl: './streaming-bar.component.html',
  styleUrls: ['./streaming-bar.component.scss'],
})
export class StreamingBarComponent implements OnInit {
  @Input() roomId: string = '';
  @Input() userId: string = '';

  @Output() toggleStream = new EventEmitter<any>();
  @Output() togglePlay = new EventEmitter<any>();

  constructor(public streamingService: StreamingService) {}

  ngOnInit() {}

  configureSocket() {
    console.log('🐱‍👤 : StreamingBarComponent : this.userId', this.userId);
    console.log('🐱‍👤 : StreamingBarComponent : this.roomId', this.roomId);
  }

  toggleStreaming() {
    // this.streamingService.requestToggleStreaming();
    this.toggleStream.emit();
  }

  startStreaming() {
    this.streamingService.requestStartStreaming();
  }

  stopStreaming() {
    this.streamingService.requestStopStreaming();
  }

  togglePlaying() {
    // this.streamingService.requestTogglePlay();
    this.togglePlay.emit();
  }

  startPlaying() {
    this.streamingService.requestStartPlay();
  }

  stopPlaying() {
    this.streamingService.requestStopPlay();
  }
}
