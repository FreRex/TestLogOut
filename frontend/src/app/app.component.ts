import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { ProjectService } from './shared/project.service';
import { UserService } from './shared/user.service';
import { RoomService } from './rooms/room.service';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';
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
  ) { }

  ngOnInit() {
    //this.authService.token = sessionStorage.getItem('token');
    //this.authService.token = localStorage.getItem('token');
    this.loadingController
      .create({ keyboardClose: true, message: 'Loading...' })
      .then(loadingEl => {
        loadingEl.present();
        this.authService.fetchToken().pipe(
          switchMap(token =>
            //console.log(this.authService.token);
            forkJoin({
              requestUsers: this.userService.loadUsers(),
              requestProjects: this.projectService.loadProjects(),
              requestRooms: this.roomService.loadRooms(),
            })
          )
        ).subscribe(({ requestUsers, requestProjects, requestRooms }) => {
          // console.log(requestUsers);
          // console.log(requestProjects);
          // console.log(requestRooms);
          loadingEl.dismiss();
        });
      });
  }
}
