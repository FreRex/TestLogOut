import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { GenericUserItemComponent } from 'src/app/shared/generic-items/generic-user-item.component';
import { UserService } from 'src/app/backoffice/users/user.service';

@Component({
  selector: 'app-users-table-item',
  templateUrl: './users-table-item.component.html',
  styleUrls: ['./users-table-item.component.scss'],
})
export class UsersTableItemComponent extends GenericUserItemComponent {

  @Input() datas;

  constructor(
    public router: Router,
    public usersService: UserService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController
  ) {
    super(
      router,
      usersService,
      authService,
      alertController,
      modalController,
      toastController
    );
  }
}
