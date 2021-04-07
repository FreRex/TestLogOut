import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
import { ProjectService } from './backoffice/projects/project.service';
import { UserService } from './backoffice/users/user.service';
import { RoomService } from './rooms/room.service';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private loadingController: LoadingController,
    private authService: AuthService,
    private userService: UserService,
    private projectService: ProjectService,
    private roomService: RoomService,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.authService.token = sessionStorage.getItem('tokenfromlogin');
    this.loadingController
      .create({ keyboardClose: true, message: 'Loading...' })
      .then(loadingEl => {
        loadingEl.present();
        // this.authService.getToken().pipe(
        // switchMap(token =>
        console.log(this.authService.token);
        forkJoin({
          requestUsers: this.userService.loadUsers(),
          requestProjects: this.projectService.loadProjects(),
          requestRooms: this.roomService.loadRooms(),
        }
          // )
          // )
        ).subscribe(({ requestUsers, requestProjects, requestRooms }) => {
          // console.log(requestUsers);
          // console.log(requestProjects);
          // console.log(requestRooms);
          loadingEl.dismiss();
        });
        // this.authService.getToken().pipe(
        //   switchMap(token => {
        //     // console.log(token);
        //     return this.userService.loadUsers()
        //   }),
        //   switchMap(users => {
        //     // console.log(users);
        //     return this.projectService.loadProjects()
        //   }),
        //   switchMap(projects => {
        //     // console.log(projects);
        //     return this.roomService.loadRooms()
        //   }),
        // ).subscribe(rooms => {
        //   // console.log(rooms);
        //   loadingEl.dismiss()
        // });
      });
  }
}
