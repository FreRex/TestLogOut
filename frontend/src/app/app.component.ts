import { Component, OnInit } from '@angular/core';
import { RoomService } from './rooms/room.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  constructor(private roomService: RoomService) {}

  /** Primo fetch dei dati sal database */
  ngOnInit() {
    // TODO: animazione loading?
    this.roomService.fetchRooms().subscribe();
  }

}
