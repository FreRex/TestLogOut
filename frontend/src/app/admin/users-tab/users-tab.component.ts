import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { GenericUserItemComponent } from 'src/app/shared/generic-items/generic-user-item.component';
import { TableColumns } from 'src/app/shared/generic-table/generic-table.component';
import { User, UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-users-tab',
  templateUrl: './users-tab.component.html',
  styleUrls: ['./users-tab.component.scss'],
})
export class UsersTabComponent extends GenericUserItemComponent implements OnInit {

  searchStream$ = new BehaviorSubject('');
  users$: Observable<User[]>;

  @ViewChild('desktopButtons', { static: true }) desktopButtons: TemplateRef<any>;
  // @ViewChild('mobileOptions', { static: true }) mobileOptions: TemplateRef<any>;
  @ViewChild('role', { static: true }) role: TemplateRef<any>;

  columns: TableColumns[] = [];
  // fields: ListFields[] = [];

  ngOnInit() {
    this.columns = [
      { title: 'ID', key: 'id', type: 'number', size: 1, orderEnabled: true },
      { title: 'Data', key: 'DataCreazione', type: 'date', size: 1, orderEnabled: true },
      { title: 'Collaudatore', key: 'collaudatoreufficio', type: 'string', size: 3, orderEnabled: true },
      { title: 'User', key: 'username', type: 'string', size: 2, orderEnabled: true },
      { title: 'Password', key: 'password', type: 'string', size: 2, orderEnabled: true },
      { title: 'Ruolo', key: 'autorizzazioni', type: 'string', size: 1, orderEnabled: true, customTemplate: this.role },
      { title: 'Azioni', key: '', type: 'buttons', size: 2, orderEnabled: false, customTemplate: this.desktopButtons }
    ];

    // this.fields = [
    //   { title: 'Collaudatore', key: 'collaudatoreufficio', type: 'string', },
    //   { title: 'Ruolo', key: 'autorizzazioni', type: 'string', customTemplate: this.role },
    //   { title: 'User', key: 'username', type: 'string', },
    //   { title: 'Commessa', key: 'commessa', type: 'string', },
    //   { title: 'Azioni', key: '', type: 'buttons', customTemplate: this.mobileOptions }
    // ];

    this.users$ = this.searchStream$.pipe(
      // debounceTime(200), //FIX
      distinctUntilChanged(),
      startWith(""),
      switchMap((query) => {
        return this.userService.getUsersByFilter(query)
      })
    );
  }

  constructor(
    public router: Router,
    public userService: UserService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController) {
    super(
      router,
      userService,
      authService,
      alertController,
      modalController,
      toastController
    );
  }

}
