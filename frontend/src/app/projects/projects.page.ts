import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
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

  // ??? mi serve ancora o posso accorparlo al ngOnInit?
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

  /** Funzione che filtra i progetti in base al fitro impostato e all'input */
  onFilter(eventValue: Event, filterValue: string) {
    let searchTerm = (<HTMLInputElement>eventValue.target).value;
    switch (filterValue) {
      case "collaudatore": {
        this.filteredProjects = this.projects.filter((project) => {
          return project.nome_collaudatore.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
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
          return project.nome_progetto.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
        break;
      }
      // TODO : case "all" = filtro multiplo
      default: {
        this.filteredProjects = this.projects;
        break;
      }
    }
  }

  /** Apre il popover per la selezione del filtro */
  openSelect(event: UIEvent, filterSelectRef: IonSelect){
    filterSelectRef.open(event);
  }

  /** Apre la pagina "Crea Progetto" */
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
