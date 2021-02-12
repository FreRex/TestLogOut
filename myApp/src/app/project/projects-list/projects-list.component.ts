import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../project.model';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
})
export class ProjectsListComponent implements OnInit {
  
  projects: Project[];

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    
    this.projectService.fetchProjects()
    .subscribe(
      res => {
        this.projects = this.projectService.getProjects();
        console.log(this.projects);

      }
    );
    
  }

}
