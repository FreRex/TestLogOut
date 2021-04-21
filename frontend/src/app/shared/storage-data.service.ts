import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { UserService } from './user.service';
import { RoomService } from '../rooms/room.service';
import { LoadingController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StorageDataService {

  constructor(
    private loadingController: LoadingController,
    private authService: AuthService,
    private userService: UserService,
    private projectService: ProjectService,
    private roomService: RoomService,
  ) { }

  isDataLoaded: boolean = false;

  loadData() {
    if (this.isDataLoaded) { return; }
    console.log('loading data');

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
          this.isDataLoaded = true;
          loadingEl.dismiss();
        });
      });
  }

}
