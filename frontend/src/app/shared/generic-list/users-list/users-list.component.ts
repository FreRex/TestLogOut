import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/shared/user.service';
import { GenericListComponent } from '../generic-list.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent extends GenericListComponent {

  constructor(private userService: UserService) {
    super();
  }
  filterData(query: any): Observable<any[]> {
    return this.userService.getUsersByFilter(query);
  }
  doRefresh(event) {
    this.userService.loadUsers().subscribe(res => { event.target.complete(); });
  }
  createUser() {

  }
}
