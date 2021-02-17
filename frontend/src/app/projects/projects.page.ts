import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreateProjectComponent } from './create-project/create-project.component';
import { Project } from './project.model';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
})
export class ProjectsPage implements OnInit {

  projects: Project[];

  constructor(
    private projectService: ProjectsService,
    private modalController: ModalController
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.projects = this.projectService.getProjects();
  }

  onUpdateProjects(){
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
        component: CreateProjectComponent
      })
      .then(modalEl => { 
        modalEl.present(); 
        return modalEl.onDidDismiss();
      })
      .then(resultData =>{
        console.log(resultData.data, resultData.role);
      });
  }

}
