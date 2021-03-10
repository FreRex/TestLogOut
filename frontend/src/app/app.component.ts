import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { RoomService } from './rooms/room.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private roomService: RoomService) { }

  isLoading: boolean;

  /** Primo fetch dei dati sal database */
  ngOnInit() {
    // this.isLoading = true;
    // this.roomService.fetchRooms().subscribe(res => {
    //   this.isLoading = false;
    // });
  }
}
