import { Injectable } from '@angular/core';
import { Project, ProjectService } from './project.service';
import { User, UserService } from './user.service';
import { Room, RoomService } from '../rooms/room.service';
import { LoadingController } from '@ionic/angular';
import { forkJoin, Observable, of } from 'rxjs';
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

  getRooms(): Observable<Room[]> {
    return this.roomService.rooms$
      .pipe(
        switchMap(rooms => {
          if (!rooms || rooms.length <= 0) { return this.roomService.loadRooms(); }
          else { return of(rooms); }
        })
      );
  }

  getUsers(): Observable<User[]> {
    return this.userService.users$
      .pipe(
        switchMap(users => {
          if (!users || users.length <= 0) { return this.userService.loadUsers(); }
          else { return of(users); }
        })
      );
  }

  getProjects(): Observable<Project[]> {
    return this.projectService.projects$
      .pipe(
        switchMap(projects => {
          if (!projects || projects.length <= 0) { return this.projectService.loadProjects(); }
          else { return of(projects); }
        })
      );
  }

  loadData() {
    if (this.isDataLoaded) { return; }
    console.log('loading data');

    //this.authService.token = sessionStorage.getItem('token');
    //this.authService.token = localStorage.getItem('token');
    // this.loadingController
    //   .create({ keyboardClose: true, message: 'Loading...' })
    //   .then(loadingEl => {
    //     loadingEl.present();
    //     this.authService.fetchToken().pipe(
    //       switchMap(token =>
    //         //console.log(this.authService.token);
    //         forkJoin({
    //           requestUsers: this.userService.loadUsers(),
    //           requestProjects: this.projectService.loadProjects(),
    //           requestRooms: this.roomService.loadRooms(),
    //         })
    //       )
    //     ).subscribe(({ requestUsers, requestProjects, requestRooms }) => {
    //       // console.log(requestUsers);
    //       // console.log(requestProjects);
    //       // console.log(requestRooms);
    //       this.isDataLoaded = true;
    //       loadingEl.dismiss();
    //     });
    //   });

  }

}
