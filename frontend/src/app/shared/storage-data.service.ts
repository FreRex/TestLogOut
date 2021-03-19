import { Injectable } from '@angular/core';
import { ProjectService } from '../backoffice/projects/project.service';
import { UserService } from '../backoffice/users/user.service';
import { RoomService } from '../rooms/room.service';

@Injectable({
  providedIn: 'root'
})
export class StorageDataService{

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private roomService: RoomService,
    ) {}

  init(){
    this.projectService.loadProjects().subscribe();
    this.userService.loadUsers();
    this.roomService.loadRooms().subscribe();
  }

}
