import { Component, OnInit } from '@angular/core';
import { Project } from '../project.model';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
})
export class ProjectsListComponent implements OnInit {

  projects: Project[];

  constructor(private projectService: ProjectsService) { }

  ngOnInit() {

    this.projectService.fetchProjects()
      .subscribe(
        res => {
          this.projects = this.projectService.getProjects();
          // this.projects = this.projectService.getProjectsFiltered("Desire Peci");
          console.log(this.projects);
        }
      );

  }

}
