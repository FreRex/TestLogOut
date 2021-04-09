import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/shared/user.service';
import { CreateUserModalComponent } from '../../modals/create-user-modal/create-user-modal.component';
import { GenericListComponent } from '../generic-list.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent extends GenericListComponent {

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
