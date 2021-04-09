import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { Project, ProjectService } from 'src/app/shared/project.service';

@Component({
  selector: 'app-projects-tab',
  templateUrl: './projects-tab.component.html',
  styleUrls: ['./projects-tab.component.scss'],
})
export class ProjectsTabComponent implements OnInit {

  searchStream$ = new BehaviorSubject('');
  projects$: Observable<Project[]>

  constructor(private projectService: ProjectService,) { }

  ngOnInit() {
    this.projects$ = this.searchStream$.pipe(
      // debounceTime(200), //FIX
      distinctUntilChanged(),
      startWith(""),
      switchMap((query) => {
        return this.projectService.getProjectsByFilter(query)
      })
    );
  }
  doRefresh(event) {
    this.projectService.loadProjects().subscribe(res => { event.target.complete(); });
  }

}
