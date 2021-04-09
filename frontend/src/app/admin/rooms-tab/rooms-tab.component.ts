import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { Room, RoomService } from 'src/app/rooms/room.service';

@Component({
  selector: 'app-rooms-tab',
  templateUrl: './rooms-tab.component.html',
  styleUrls: ['./rooms-tab.component.scss'],
})
export class RoomsTabComponent implements OnInit {

  searchStream$ = new BehaviorSubject('');
  rooms$: Observable<Room[]>

  constructor(private roomService: RoomService,) { }

  ngOnInit() {
    this.rooms$ = this.searchStream$.pipe(
      // debounceTime(200), //FIX
      distinctUntilChanged(),
      startWith(""),
      switchMap((query) => {
        return this.roomService.getRoomsByFilter(query)
      })
    );
  }
  doRefresh(event) {
    this.roomService.loadRooms().subscribe(res => { event.target.complete(); });
  }

}
