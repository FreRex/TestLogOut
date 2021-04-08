import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-generic-list',
  template: ``,
  styleUrls: ['./generic-list.component.scss'],
})
export abstract class GenericListComponent implements OnInit {

  searchStream$ = new BehaviorSubject('');
  obs$: Observable<any[]>;

  constructor() { }

  ngOnInit() {
    this.loadList();
  }

  loadList() {
    this.obs$ = this.searchStream$.pipe(
      // debounceTime(200), //FIX
      distinctUntilChanged(),
      // startWith(""),
      switchMap((query) => {
        return this.filterData(query);
      }),
    );
  }

  abstract filterData(query): Observable<any[]>;
  abstract doRefresh(event);
}
