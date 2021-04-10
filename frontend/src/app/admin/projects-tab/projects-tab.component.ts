import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { GenericProjectItemComponent } from 'src/app/shared/generic-items/generic-project-item.component';
import { TableData } from 'src/app/shared/generic-table/generic-table.component';
import { Project, ProjectService } from 'src/app/shared/project.service';

@Component({
  selector: 'app-projects-tab',
  templateUrl: './projects-tab.component.html',
  styleUrls: ['./projects-tab.component.scss'],
})
export class ProjectsTabComponent extends GenericProjectItemComponent implements OnInit {

  searchStream$ = new BehaviorSubject('');
  projects$: Observable<Project[]>;
  @ViewChild('buttons', { static: true }) buttons: TemplateRef<any>;
  columns: TableData[] = [];

  constructor(
    public router: Router,
    public projectService: ProjectService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController) {
    super(
      router,
      projectService,
      authService,
      alertController,
      modalController,
      toastController
    );
  }

  ngOnInit() {
    this.columns = [
      { title: 'ID', key: 'idprogetto', type: 'number', size: 1, orderEnabled: true },
      { title: 'Sync', key: 'sync', type: 'boolean', size: 1, orderEnabled: true },
      { title: 'Data', key: 'datasincro', type: 'date', size: 1, orderEnabled: true },
      { title: 'PK Project', key: 'pk_proj', type: 'string', size: 2, orderEnabled: true },
      { title: 'Nome Progetto', key: 'nome', type: 'string', size: 3, orderEnabled: true },
      { title: 'Collaudatore', key: 'collaudatoreufficio', type: 'string', size: 2, orderEnabled: true },
      { title: 'Azioni', key: '', type: 'buttons', size: 2, orderEnabled: true, cellTemplate: this.buttons },
    ];

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
