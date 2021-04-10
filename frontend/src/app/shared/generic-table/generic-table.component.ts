import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

export interface TableData {
  title: string;
  key: string;
  type: string;
  size: number;
  orderEnabled?: boolean
  cellTemplate?: TemplateRef<any>;
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
  // @Input() itemTemplate: TemplateRef<any>;
  @Input() columns: TableData[] = []
  @Input() inputDatas$: Observable<any[]>;
  datas$: Observable<any[]>;

  isCrescent = true;
  selectedData: TableData;

  page = 0;
  totalNumberOfRecords: number;
  totalPages: number = 1;
  recordsPerPage = 10;

  constructor() { }

  ngOnInit() {
    this.page = 0;
    this.loadPage(this.page);
  }

  loadPage(page: number) {
    this.page = page;
    this.datas$ = this.inputDatas$.pipe(
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
          } else if (this.selectedData.type === 'string') {
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

  // abstract filterData(query): Observable<any[]>;
  // abstract doRefresh(event);

  sortBy(data: TableData, isCrescent: boolean) {
    this.selectedData = data;
    this.isCrescent = isCrescent;
    this.page = 0;
    this.loadPage(this.page);
  }
}
