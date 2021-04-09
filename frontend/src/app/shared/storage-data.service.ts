import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { UserService } from './user.service';
import { RoomService } from '../rooms/room.service';

@Injectable({
  providedIn: 'root'
})
export class StorageDataService {

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private roomService: RoomService,
  ) { }

  init() {
    this.projectService.loadProjects();
    this.userService.loadUsers();
  }

}
