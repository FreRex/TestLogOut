import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { Room, RoomService } from '../../rooms/room.service';

export interface Data {
  title: string;
  value: string;
  type: string;
  size: number;
}

@Component({
  selector: 'app-rooms-table',
  templateUrl: './rooms-table.component.html',
  styleUrls: ['./rooms-table.component.scss'],
})
export class RoomsTableComponent implements OnInit {

  searchStream$ = new BehaviorSubject('');

  rooms$;

  constructor(
    private roomService: RoomService,
  ) { }

  ngOnInit() {
    this.rooms$ = this.searchStream$.pipe(
      // debounceTime(200), //FIX
      distinctUntilChanged(),
      // startWith(""),
      switchMap((query) => {
        return this.roomService.getRoomsByFilter(query);
      }));

  }

}
