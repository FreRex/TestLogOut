import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectService } from 'src/app/backoffice/projects/project.service';
import { GenericListComponent } from '../generic-list.component';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
})
export class ProjectsListComponent extends GenericListComponent {

  constructor(private projectService: ProjectService) {
    super();
  }
  filterData(query: any): Observable<any[]> {
    return this.projectService.getProjectsByFilter(query);
  }
  doRefresh(event) {
    this.projectService.loadProjects().subscribe(res => { event.target.complete(); });
  }
  createRoom() {

  }
}
