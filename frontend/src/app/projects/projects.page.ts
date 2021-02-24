import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
// import { EditProjectModalComponent } from '../angular_components/edit-project-modal/edit-project-modal.component';
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
  isSearchMode: boolean = false;

  constructor(
    private projectService: ProjectsService,
    private modalController: ModalController,
    private router: Router,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.subscription = this.projectService.projectsChanged.subscribe(
      (projects: Project[]) => {
        this.projects = projects;
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

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

  filteredProjects = [];
  filter: string = 'progetto';

  onFilter(event: Event){
    let searchTerm = (<HTMLInputElement>event.target).value;
    switch (this.filter) {
      case "collaudatore": {
        this.filteredProjects = this.projects.filter((project) => {
          return project.collaudatore.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
        break;
      }
      case "usermobile": {
        this.filteredProjects = this.projects.filter((project) => {
          return project.usermobile.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
        break;
      }
      case "progetto": {
        this.filteredProjects = this.projects.filter((project) => {
          return project.progetto.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
        break;
      }
      default: {
        this.filteredProjects = this.projects; 
        break;
      }
    }
  }

  onNewProjectPage() {
    this.storage.set('edit', false);
    this.router.navigate(['/', 'projects', 'new']);
  }

  // onCreateProjectModal() {
  //   this.modalController
  //     .create({
  //       component: EditProjectModalComponent,
  //       componentProps: {
  //         isEditMode: false
  //       }
  //     })
  //     .then(modalEl => {
  //       modalEl.present();
  //       return modalEl.onDidDismiss();
  //     })
  //     .then(resultData => {
  //       console.log(resultData.data, resultData.role);
  //     });
  // }

}
