import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { ProjectService } from 'src/app/shared/project.service';
import { GenericProjectItemComponent } from 'src/app/shared/generic-items/generic-project-item.component';
import { DashboardService } from '../../dashboard.service';

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
       dashService ,
       loadingController ,
    );
  }

  ngOnInit() { }

}
