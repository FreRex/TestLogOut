import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {

  @Input() page = 0;
  @Input() totalPages: number = 1;
  @Output() event = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  nextPage() {
    this.page = this.page++ >= this.totalPages - 1 ? this.totalPages - 1 : this.page;
    this.event.emit(this.page);
  }
  prevPage() {
    this.page = this.page-- <= 0 ? 0 : this.page;
    this.event.emit(this.page);
  }
  goFirst() {
    this.page = 0;
    this.event.emit(this.page);
  }
  goLast() {
    this.page = this.totalPages - 1;
    this.event.emit(this.page);
  }
}
