import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { ProjectService } from 'src/app/shared/project.service';
import { GenericProjectItemComponent } from 'src/app/shared/generic-items/generic-project-item.component';

@Component({
  selector: 'app-projects-list-item',
  templateUrl: './projects-list-item.component.html',
  styleUrls: ['../../generic-list/generic-list.component.scss'],
})
export class ProjectsListItemComponent extends GenericProjectItemComponent {

  constructor(
    public router: Router,
    public projectService: ProjectService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController
  ) {
    super(
      router,
      projectService,
      authService,
      alertController,
      modalController,
      toastController
    );
  }

}
