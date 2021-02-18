import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { EditProjectModalComponent } from './edit-project/edit-project-modal/edit-project-modal.component';
import { Project } from './project.model';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
})
export class ProjectsPage implements OnInit, OnDestroy {

  projects: Project[];
  subscription: Subscription;

  constructor(
    private projectService: ProjectsService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.subscription = this.projectService.projectsChanged.subscribe(
      (projects: Project[]) => {
        this.projects = projects;
      });
  }
  ngOnDestroy() { this.subscription.unsubscribe(); }

  ionViewWillEnter() {
    this.projects = this.projectService.getProjects();
  }

  onUpdateProjects() {
    this.projectService.fetchProjects()
      .subscribe(
        res => {
          this.projects = this.projectService.getProjects();
        }
      );
  }

  onCreateProject() {
    this.modalController
      .create({
        component: EditProjectModalComponent,
        componentProps: {
          isEditMode: false
        }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
      });
  }

}
