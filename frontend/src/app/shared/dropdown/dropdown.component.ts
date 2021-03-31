import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {

  @Input() isListOpen: boolean;
  @Input() input: IonInput;
  @Input() searchValue: string;
  @Input() obs$: Observable<any[]>;
  items$: Observable<any[]>;
  @Output() event = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.items$ = this.input.ionInput.pipe(
      map((event) => (<HTMLInputElement>event.target).value),
      debounceTime(400),
      distinctUntilChanged(),
      startWith(""),
      switchMap(search =>
        this.obs$.pipe(
          map(obs =>
            obs.filter(item =>
              item[this.searchValue].toLowerCase().includes(search.toLowerCase())
            )
          )
        )
      )
    );
  }
}
