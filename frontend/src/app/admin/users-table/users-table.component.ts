import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { User, UserService } from 'src/app/backoffice/users/user.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent implements OnInit {
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
  users$: Observable<User[]>;
  searchStream$ = new BehaviorSubject('');

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.loadPage();
  }

  loadPage() {
    this.users$ = this.searchStream$.pipe(
      // debounceTime(200), //FIX
      distinctUntilChanged(),
      // startWith(""),
      switchMap((query) => {
        // if (query && query.length > 0) this.page = 0; //FIX
        return this.userService.getUsersByFilter(query);
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
  doRefresh(event) {
    this.userService.loadUsers().subscribe(res => { event.target.complete(); });
  }

}
