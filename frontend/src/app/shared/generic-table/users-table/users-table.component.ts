import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/shared/user.service';
import { CreateUserModalComponent } from '../../modals/create-user-modal/create-user-modal.component';
import { GenericTableComponent, TableData } from '../generic-table.component';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent extends GenericTableComponent {

  columns: TableData[] = [
    { title: 'ID', key: 'id', type: 'number', size: 1 },
    { title: 'Data', key: 'DataCreazione', type: 'date', size: 1 },
    { title: 'Collaudatore', key: 'collaudatoreufficio', type: 'string', size: 3 },
    { title: 'User', key: 'username', type: 'string', size: 2 },
    { title: 'Password', key: 'password', type: 'string', size: 2 },
    { title: 'Ruolo', key: 'autorizzazioni', type: 'icon', size: 1 },
    // { title: 'Gruppo', key: 'xxxxxxxxxxx', type: 'string', size: 1 },
    { title: 'Azioni', key: 'azioni', type: 'buttons', size: 2 },
  ];

  constructor(
    private userService: UserService,
    private modalController: ModalController
  ) {
    super();
  }
  filterData(query: any): Observable<any[]> {
    return this.userService.getUsersByFilter(query);
  }
  doRefresh(event) {
    this.userService.loadUsers().subscribe(res => { event.target.complete(); });
  }
  createUser() {
    this.modalController
      .create({
        component: CreateUserModalComponent,
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
  }
}
