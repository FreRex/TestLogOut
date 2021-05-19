import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { forkJoin } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { StorageDataService } from '../shared/storage-data.service';
import { CommissionService } from './commission-tab/commission.service';
import { ProjectService } from './projects-tab/project.service';
import { UserService } from './users-tab/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  constructor(
    private dataService: StorageDataService,
    private loadingController: LoadingController,
    private authService: AuthService,
    private userService: UserService,
    public commissionService: CommissionService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.loadingController
      .create({ keyboardClose: true, message: 'Loading...' })
      .then((loadingEl) => {
        loadingEl.present();
        forkJoin({
          reqUsers: this.userService.loadUsers(),
          reqCommissions: this.commissionService.loadCommissions(),
          reqProjects: this.projectService.loadProjects(),
          // requestRooms: this.roomService.loadRooms(),
        }).subscribe(({ reqUsers, reqCommissions, reqProjects }) => {
          loadingEl.dismiss();
        });
      });
  }
}
