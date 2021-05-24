import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ViewWillEnter } from '@ionic/angular';

import { CommissionService } from '../admin/commission-tab/commission.service';
import { ProjectService } from '../admin/projects-tab/project.service';
import { UserService } from '../admin/users-tab/user.service';
import { AuthService } from '../auth/auth.service';
import { StorageDataService } from '../shared/storage-data.service';
import { RoomService } from './room.service';

@Component({
  selector: 'app-room',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements ViewWillEnter {
  constructor(
    public route: ActivatedRoute,
    public authService: AuthService,
    public roomService: RoomService,
    public userService: UserService,
    public commissionService: CommissionService,
    public storageData: StorageDataService,
    public projectService: ProjectService,
    private loadingController: LoadingController
  ) {}

  ionViewWillEnter() {
    this.loadingController
      .create({ keyboardClose: true, message: 'Loading Rooms...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.roomService
          .loadRooms()
          // .pipe(shareReplay({ refCount: true, bufferSize: 1 }), takeUntil(this.destroy$))
          .subscribe((rooms) => {
            console.log('🐱‍👤 : RoomsPage : rooms', rooms);
            loadingEl.dismiss();
          });
      });

    // let users: User[];
    // this.loadingController
    //   .create({ keyboardClose: true, message: 'Loading...' })
    //   .then((loadingEl) => {
    //     loadingEl.present();
    //     this.authService
    //       .fetchToken()
    //       .pipe(
    //         switchMap((token) =>
    //           forkJoin({
    //             reqUsers: this.userService.loadUsers(),
    //             reqCommissions: this.commissionService.loadCommissions(),
    //             reqProjects: this.projectService.loadProjects(),
    //           })
    //         ),
    //         switchMap(({ reqUsers, reqCommissions, reqProjects }) => {
    //           users = reqUsers;
    //           return this.route.queryParams;
    //         }),
    //         switchMap((params) => {
    //           let codiceUtente;
    //           if (params && params['user']) {
    //             // se arrivi dal login hai un codice
    //             // quindi entra con il tuo codice (user - admin)
    //             codiceUtente = params['user'];
    //           } else {
    //             // se non sei passato dal login e non c'è il codice
    //             // entra come utente 2 - Ospiti (user)
    //             codiceUtente = 'tCBK24ur9O';
    //           }
    //           console.log('codiceUtente: ', codiceUtente);
    //           const user = users.find((user) => user.idutcas === codiceUtente);
    //           this.authService.onLogin(user);
    //           return this.roomService.loadRooms();
    //         })
    //       )
    //       .subscribe(
    //         (rooms) => {
    //           loadingEl.dismiss();
    //         },
    //         (error) => {
    //           console.log(error);
    //         }
    //       );
    //   });
  }
}
