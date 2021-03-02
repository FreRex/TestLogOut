import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonInput, IonSearchbar, IonSelect, ModalController } from '@ionic/angular';
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
  filteredProjects = [];

  constructor(
    private projectService: ProjectsService,
    private router: Router,
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
    this.filteredProjects = this.projects;
  }

  doRefresh(event) {
    this.projectService.fetchProjects()
      .subscribe(
        res => {
          this.projects = this.projectService.getProjects();
          this.filteredProjects = this.projects;
          event.target.complete();
        }
      );
  }

  onFilter(event: Event, filter: string) {
    let searchTerm = (<HTMLInputElement>event.target).value;
    switch (filter) {
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

  openSelect(filter: IonSelect){
    filter.open();
  }
  
  onNewProjectPage() {
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
