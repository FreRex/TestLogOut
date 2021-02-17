import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { Project } from '../project.model';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.page.html',
  styleUrls: ['./project-detail.page.scss'],
})
export class ProjectDetailPage implements OnInit {

  loadedProject: Project;

  constructor(
    private activatedRouter: ActivatedRoute,
    private projectService: ProjectsService,
    private router: Router,
    private alertController: AlertController,
    private navController:  NavController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.activatedRouter.paramMap.subscribe(paramMap => {
      if (!paramMap.has('projectId')) {
        this.navController.navigateBack(['/projects']);
        return;
      }
      const projectId = paramMap.get('projectId');
      console.log(projectId);

      this.loadedProject = this.projectService.getProjectById(projectId);
      console.log(this.loadedProject.usermobile);

    });
  }

  onEditProject() {
    this.modalController
      .create({
        component: CreateProjectComponent,
        componentProps: {
          project: this.loadedProject
        }
      })
      .then(modalEl => { modalEl.present(); });
  }

  onDeleteProject() {
    this.alertController.create(
      {
        header: 'Sei sicuro?',
        message: 'Vuoi davvero cancellare il progetto?',
        buttons: [
          {
            text: 'Annulla',
            role: 'cancel'
          },
          {
            text: 'Elimina',
            handler: () => {
              this.projectService.deleteProject(this.loadedProject.usermobile);
              this.navController.navigateBack(['/projects']);
            }
          }
        ]
      }
    ).then(alertEl => { alertEl.present(); });
  }

}
