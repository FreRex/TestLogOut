import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

import { ProjectService } from './admin/projects-tab/project.service';
import { UserService } from './admin/users-tab/user.service';
import { AuthService } from './auth/auth.service';
import { RoomService } from './rooms/room.service';
import { StorageDataService } from './shared/storage-data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private dataService: StorageDataService,
    private loadingController: LoadingController,
    private authService: AuthService,
    private alertController: AlertController,
    private userService: UserService,
    private projectService: ProjectService,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.authService.getLoginToken().subscribe(
      (loginToken) => {
        console.log('🐱‍👤 : AppComponent : loginToken', loginToken);
      },
      (err) => {
        this.showAlert(err);
      }
    );

    // this.dataService.loadData();
    // this.authService.token = sessionStorage.getItem('token');
    // this.authService.token = localStorage.getItem('token');
    // this.loadingController
    //   .create({ keyboardClose: true, message: 'Loading...' })
    //   .then((loadingEl) => {
    //     loadingEl.present();
    //     // TODO : sistemare la logica del token iniziale!
    //     this.authService.getLoginToken()
    //       // .pipe(
    //       //   switchMap((token) =>
    //       //     //console.log(this.authService.token);
    //       //     forkJoin({
    //       //       requestUsers: this.userService.loadUsers(),
    //       //       requestProjects: this.projectService.loadProjects(),
    //       //       // requestRooms: this.roomService.loadRooms(),
    //       //     })
    //       //   )
    //       // )
    //       .subscribe(
    //         () => {
    //           loadingEl.dismiss();
    //         }
    //       );
    //   });
  }

  private showAlert(message: string) {
    this.alertController
      .create({
        header: 'Autenticazione fallita',
        message: message,
        buttons: ['Okay'],
      })
      .then((alertEl) => alertEl.present());
  }
}
