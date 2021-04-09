import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { User, UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-users-tab',
  templateUrl: './users-tab.component.html',
  styleUrls: ['./users-tab.component.scss'],
})
export class UsersTabComponent implements OnInit {

  searchStream$ = new BehaviorSubject('');
  users$: Observable<User[]>

  constructor(private userService: UserService,) { }

  ngOnInit() {
    this.users$ = this.searchStream$.pipe(
      // debounceTime(200), //FIX
      distinctUntilChanged(),
      startWith(""),
      switchMap((query) => {
        return this.userService.getUsersByFilter(query)
      })
    );
  }
  doRefresh(event) {
    this.userService.loadUsers().subscribe(res => { event.target.complete(); });
  }

}
