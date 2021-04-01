import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Room, RoomService } from '../../room.service';

@Component({
  selector: 'app-rooms-table',
  templateUrl: './rooms-table.component.html',
  styleUrls: ['./rooms-table.component.scss'],
})
export class RoomsTableComponent implements OnInit {

  /* TABELLA */
  bulkEdit = true;
  edit = {};

  sortKey = 'id';
  isCrescent = true;

  page = 0;
  totalNumberOfRooms: number;
  totalPages: number;
  startFromRecord = 0;
  recordsPerPage = 15;
  rooms$: Observable<Room[]>;

  constructor(
    private roomService: RoomService,
  ) { }

  ngOnInit() {
    this.sortBy('id', true, true);
  }

  sortBy(key: any, isNumber: boolean, crescent: boolean) {
    this.rooms$ = this.roomService.rooms$.pipe(
      tap(rooms => {
        this.totalNumberOfRooms = rooms.length;
        this.totalPages = Math.ceil(this.totalNumberOfRooms / this.recordsPerPage);
      }),
      map(rooms => rooms.sort((r1: any, r2: any) => {
        if (isNumber) {
          return crescent ? r1[key] - r2[key] : r2[key] - r1[key];
        } else {
          return crescent ?
            r1[key].toString().localeCompare(r2[key].toString()) :
            r2[key].toString().localeCompare(r1[key].toString());
        }
      })),
      map(rooms => rooms.slice(this.startFromRecord, this.recordsPerPage))
    );
  }
  /* TABELLA */
  // sort() {
  //   if (this.sortDirection == 1) {
  //     this.rooms = this.rooms.sort((a, b) => {
  //       const valA = a[this.sortKey].toString();
  //       const valB = b[this.sortKey].toString();
  //       return valA.localeCompare(valB);
  //     })
  //   } else if (this.sortDirection == 2) {
  //     this.rooms = this.rooms.sort((a, b) => {
  //       const valA = a[this.sortKey].toString();
  //       const valB = b[this.sortKey].toString();
  //       return valB.localeCompare(valA);
  //     })
  //   } else {
  //     this.sortDirection = 0;
  //     this.sortKey = null;
  //   }
  // }
  nextPage() {
    this.page++;
  }
  prevPage() {
    this.page--;
  }
  goFirst() {
    this.page = 0;
  }
  goLast() {
    this.page = this.totalPages - 1;
  }

}
