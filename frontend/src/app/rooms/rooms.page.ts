import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from './room.service';
import { AuthService } from '../auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { User, UserService } from '../admin/users-tab/user.service';
import { ProjectService } from '../admin/projects-tab/project.service';
import { StorageDataService } from '../shared/storage-data.service';
import { CommissionService } from '../admin/commission-tab/commission.service';

@Component({
  selector: 'app-room',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements OnInit {

  constructor(
    public route: ActivatedRoute,
    public authService: AuthService,
    public roomService: RoomService,
    public userService: UserService,
    public commissionService: CommissionService,
    public storageData: StorageDataService,
    public projectService: ProjectService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    let users: User[];
    this.loadingController
      .create({ keyboardClose: true, message: 'Loading...' })
      .then(loadingEl => {
        loadingEl.present();
        this.authService.fetchToken().pipe(
          switchMap(token =>
            forkJoin({
              reqUsers: this.userService.loadUsers(),
              reqCommissions: this.commissionService.loadCommissions(),
              reqProjects: this.projectService.loadProjects(),
            })
          ),
          switchMap(({ reqUsers, reqCommissions, reqProjects }) => {
            users = reqUsers;
            return this.route.queryParams
          }),
          switchMap(params => {
            let codiceUtente = '0';
            if (params && params['user']) {
              codiceUtente = params['user'];
              console.log('codiceUtente: ', codiceUtente);
              const user = users.find(user => user.idutcas === codiceUtente);
              this.authService.onLogin(user);
            } else {
              this.authService.onLogin({
                id: 0,
                idutcas: '0',
                DataCreazione: null,
                collaudatoreufficio: null,
                username: null,
                password: null,
                autorizzazioni: 'user',
                idcommessa: null,
                commessa: 'commessa',
              });
            }
            return this.roomService.loadRooms();
          }),
        ).subscribe(
          rooms => {
            loadingEl.dismiss();
          }, error => {
            console.log(error);
          });
      });
  }

}
