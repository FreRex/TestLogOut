import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { EditProjectModalComponent } from '../edit-project/edit-project-modal/edit-project-modal.component';
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
    private projectsService: ProjectsService,
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
      this.loadedProject = this.projectsService.getProjectById(projectId);
    });
  }

  onEditProject() {
    this.modalController
      .create({
        component: EditProjectModalComponent,
        componentProps: {
          projectId: this.loadedProject.usermobile,
          isEditMode: true
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
              this.projectsService.deleteProject(this.loadedProject.usermobile);
              this.navController.navigateBack(['/projects']);
            }
          }
        ]
      }
    ).then(alertEl => { alertEl.present(); });
  }

}
