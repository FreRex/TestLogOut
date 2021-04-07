import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { RoomService } from '../../rooms/room.service';

export interface Data {
  title: string;
  key: string;
  type: string;
  size: number;
}

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
})
export class GenericTableComponent implements OnInit {

  /* TABELLA */
  // bulkEdit = true;
  // edit = {};

  @Input() datas: Data[] = []
  @Input() inputObs$: Observable<any[]>;
  keys = []

  isCrescent = true;
  selectedData: Data;

  page = 0;
  totalNumberOfRecords: number;
  totalPages: number = 1;
  startFromRecord = 0;
  recordsPerPage = 10;
  obs$: Observable<any[]>;
  searchStream$ = new BehaviorSubject('');

  constructor(
    private roomService: RoomService,
  ) { }

  ngOnInit() {
    [...this.datas].map(data => { if (data.type === 'string') this.keys.push(data.key) });
    console.log(this.keys);
    this.loadPage();
  }

  loadPage() {
    this.obs$ = this.searchStream$.pipe(
      // debounceTime(200), //FIX
      distinctUntilChanged(),
      // startWith(""),
      switchMap((query) => {
        // if (query && query.length > 0) this.page = 0; //FIX
        // return this.roomService.getRoomsByFilter(query)
        // return combineLatest([this.inputObs$, of(...this.keys)]).pipe(
        //   map(([obs, key]) =>
        //     obs.filter(ob =>
        //       ob[key].toString().toLowerCase().includes(query.toLowerCase())
        //     )
        //   )
        // )
        return this.inputObs$.pipe(
          map(obs =>
            obs.filter(ob =>
              ob['usermobile'].toString().toLowerCase().includes(query.toLowerCase()) ||
              ob['nome_progetto'].toString().toLowerCase().includes(query.toLowerCase()) ||
              ob['nome_collaudatore'].toString().toLowerCase().includes(query.toLowerCase())
            )
          )
        )
      }),
      tap(res => {
        // console.log(res);
        this.totalNumberOfRecords = res.length;
        this.totalPages = Math.ceil(this.totalNumberOfRecords / this.recordsPerPage);
        if (this.page > this.totalPages) this.page = 0;
      }),
      map(res => res.sort((r1: any, r2: any) => {
        if (this.selectedData) {
          if (this.selectedData.type === 'number' || this.selectedData.type === 'date') {
            return this.isCrescent ? r1[this.selectedData.key] - r2[this.selectedData.key] : r2[this.selectedData.key] - r1[this.selectedData.key];
          } else {
            return this.isCrescent ?
              r1[this.selectedData.key].toString().localeCompare(r2[this.selectedData.key].toString()) :
              r2[this.selectedData.key].toString().localeCompare(r1[this.selectedData.key].toString());
          }
        } else {
          return of(res);
        }
      })),
      map(res => res.slice(this.page * this.recordsPerPage, this.page * this.recordsPerPage + this.recordsPerPage))
    );
  }

  sortBy(data: Data, isCrescent: boolean) {
    this.page = 0;
    this.selectedData = data;
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
