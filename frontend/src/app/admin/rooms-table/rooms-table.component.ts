import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { Room, RoomService } from '../../rooms/room.service';

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
  isNumeric = true;

  page = 0;
  totalNumberOfRecords: number;
  totalPages: number = 1;
  startFromRecord = 0;
  recordsPerPage = 10;
  rooms$: Observable<Room[]>;
  searchStream$ = new BehaviorSubject('');

  constructor(
    private roomService: RoomService,
  ) { }

  ngOnInit() {
    this.loadPage();
  }

  loadPage() {
    this.rooms$ = this.searchStream$.pipe(
      // debounceTime(200), //FIX
      distinctUntilChanged(),
      // startWith(""),
      switchMap((query) => {
        // if (query && query.length > 0) this.page = 0; //FIX
        return this.roomService.getRoomsByFilter(query);
      }),
      tap(res => {
        this.totalNumberOfRecords = res.length;
        this.totalPages = Math.ceil(this.totalNumberOfRecords / this.recordsPerPage);
        if (this.page > this.totalPages) this.page = 0;
      }),
      map(res => res.sort((r1: any, r2: any) => {
        if (this.isNumeric) {
          return this.isCrescent ? r1[this.sortKey] - r2[this.sortKey] : r2[this.sortKey] - r1[this.sortKey];
        } else {
          return this.isCrescent ?
            r1[this.sortKey].toString().localeCompare(r2[this.sortKey].toString()) :
            r2[this.sortKey].toString().localeCompare(r1[this.sortKey].toString());
        }
      })),
      map(res => res.slice(this.page * this.recordsPerPage, this.page * this.recordsPerPage + this.recordsPerPage))
    );
  }

  sortBy(key: any, isNumeric: boolean, isCrescent: boolean) {
    this.page = 0;
    this.sortKey = key;
    this.isNumeric = isNumeric;
    this.isCrescent = isCrescent;
    this.loadPage();
  }
  nextPage() {
    this.page = this.page++ >= this.totalPages - 1 ? this.totalPages - 1 : this.page;
    this.loadPage();
  }
  prevPage() {
    this.page = this.page-- <= 0 ? 0 : this.page;
    this.loadPage();
  }
  goFirst() {
    this.page = 0;
    this.loadPage();
  }
  goLast() {
    this.page = this.totalPages - 1;
    this.loadPage();
  }

}
