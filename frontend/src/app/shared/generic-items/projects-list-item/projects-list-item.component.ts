import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { ProjectService } from 'src/app/shared/project.service';
import { GenericProjectItemComponent } from 'src/app/shared/generic-items/generic-project-item.component';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-projects-list-item',
  templateUrl: './projects-list-item.component.html',
})
export class ProjectsListItemComponent extends GenericProjectItemComponent {

  constructor(
    public router: Router,
    public projectService: ProjectService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController,
    public dashService: DashboardService,
    public loadingController: LoadingController,
  ) {
    super(
      router,
      projectService,
      authService,
      alertController,
      modalController,
      toastController,
      dashService,
      loadingController
    );
  }

}
