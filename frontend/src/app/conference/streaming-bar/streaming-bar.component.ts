import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AudioRTCService } from 'src/app/conference/audiortc.service';

@Component({
  selector: 'app-streaming-bar',
  templateUrl: './streaming-bar.component.html',
  styleUrls: ['./streaming-bar.component.scss'],
})
export class StreamingBarComponent implements OnInit {
  @Input() isStreaming: boolean = false;
  @Input() isPlaying: boolean = true;

  @Input() roomId: string = '';
  @Input() userId: string = '';

  @Output() toggleStream = new EventEmitter<any>();
  @Output() togglePlay = new EventEmitter<any>();
  @Output() capturePhoto = new EventEmitter<any>();

  constructor(public audioService: AudioRTCService) {}

  ngOnInit() {}

  configureSocket() {
    console.log('🐱‍👤 : StreamingBarComponent : this.userId', this.userId);
    console.log('🐱‍👤 : StreamingBarComponent : this.roomId', this.roomId);
  }

  toggleStreaming() {
    // this.streamingService.requestToggleStreaming();
    this.toggleStream.emit();
  }

  togglePlaying() {
    // this.streamingService.requestTogglePlay();
    this.togglePlay.emit();
  }

  capturingPhoto() {
    this.capturePhoto.emit();
  }
}
