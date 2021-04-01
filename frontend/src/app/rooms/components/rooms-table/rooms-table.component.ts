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
  isNumeric = true;

  page = 0;
  totalNumberOfRecords: number;
  totalPages: number;
  startFromRecord = 0;
  recordsPerPage = 15;
  rooms$: Observable<Room[]>;

  constructor(
    private roomService: RoomService,
  ) { }

  ngOnInit() {
    this.loadPage();
  }

  loadPage() {
    this.rooms$ = this.roomService.rooms$.pipe(
      tap(res => {
        this.totalNumberOfRecords = res.length;
        this.totalPages = Math.ceil(this.totalNumberOfRecords / this.recordsPerPage);
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
