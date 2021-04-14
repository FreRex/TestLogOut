import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { ProjectService } from 'src/app/shared/project.service';
import { GenericProjectItemComponent } from 'src/app/shared/generic-items/generic-project-item.component';

@Component({
  selector: 'app-projects-table-item',
  templateUrl: './projects-table-item.component.html',
  styleUrls: ['../../generic-table/generic-table.component.scss'],
})
export class ProjectsTableItemComponent extends GenericProjectItemComponent {

  @Input() columns;

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

  ngOnInit() { }

}
