import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/shared/user.service';
import { GenericUserItemComponent } from 'src/app/shared/generic-items/generic-user-item.component';

@Component({
  selector: 'app-users-list-item',
  templateUrl: './users-list-item.component.html',
  styleUrls: ['../../generic-list/generic-list.component.scss'],
})
export class UsersListItemComponent extends GenericUserItemComponent {

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