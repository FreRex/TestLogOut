import { Component, Input, OnInit } from '@angular/core';

import { StreamingService } from '../streaming.service';

@Component({
  selector: 'app-streaming-bar',
  templateUrl: './streaming-bar.component.html',
  styleUrls: ['./streaming-bar.component.scss'],
})
export class StreamingBarComponent implements OnInit {
  @Input() roomId: string = '';
  @Input() userId: string = '';

  constructor(public streamingService: StreamingService) {}

  ngOnInit() {}

  configureSocket() {
    console.log('🐱‍👤 : StreamingBarComponent : this.userId', this.userId);
    console.log('🐱‍👤 : StreamingBarComponent : this.roomId', this.roomId);
  }

  toggleStreaming() {
    this.streamingService.requestToggleStreaming();
  }

  startStreaming() {
    this.streamingService.requestStartStreaming();
  }

  stopStreaming() {
    this.streamingService.requestStopStreaming();
  }
}
