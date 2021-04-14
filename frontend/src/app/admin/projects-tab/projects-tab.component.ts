import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { GenericProjectItemComponent } from 'src/app/shared/generic-items/generic-project-item.component';
import { ListFields } from 'src/app/shared/generic-list/generic-list.component';
import { TableColumns } from 'src/app/shared/generic-table/generic-table.component';
import { GisfoSyncModalComponent } from 'src/app/shared/modals/gisfo-sync-modal/gisfo-sync-modal.component';
import { UploadShpModalComponent } from 'src/app/shared/modals/upload-shp-modal/upload-shp-modal.component';
import { Project, ProjectService } from 'src/app/shared/project.service';

@Component({
  selector: 'app-projects-tab',
  templateUrl: './projects-tab.component.html',
  styleUrls: ['./projects-tab.component.scss'],
})
export class ProjectsTabComponent extends GenericProjectItemComponent implements OnInit {

  searchStream$ = new BehaviorSubject('');
  projects$: Observable<Project[]>;

  @ViewChild('desktopButtons', { static: true }) desktopButtons: TemplateRef<any>;
  // @ViewChild('mobileOptions', { static: true }) mobileOptions: TemplateRef<any>;
  @ViewChild('sync', { static: true }) sync: TemplateRef<any>;

  columns: TableColumns[] = [];
  // fields: ListFields[] = [];

  ngOnInit() {
    this.columns = [
      { title: 'ID', key: 'idprogetto', type: 'number', size: 1, orderEnabled: true },
      { title: 'Sync', key: 'sync', type: 'string', size: 1, orderEnabled: true, customTemplate: this.sync },
      { title: 'Data', key: 'datasincro', type: 'date', size: 1, orderEnabled: true },
      { title: 'PK Project', key: 'pk_proj', type: 'string', size: 2, orderEnabled: true },
      { title: 'Nome Progetto', key: 'nome', type: 'string', size: 3, orderEnabled: true },
      { title: 'Collaudatore', key: 'collaudatoreufficio', type: 'string', size: 2, orderEnabled: true },
      { title: 'Azioni', key: '', type: 'buttons', size: 2, orderEnabled: false, customTemplate: this.desktopButtons },
    ];

    // this.fields = [
    //   { title: 'Nome Progetto', key: 'nome', type: 'string' },
    //   { title: 'Data', key: 'datasincro', type: 'data' },
    //   { title: 'Sync', key: 'sync', type: 'string' },
    //   { title: 'Collaudatore', key: 'collaudatoreufficio', type: 'string' },
    //   { title: 'Azioni', key: '', type: 'boolean', customTemplate: this.mobileOptions },
    // ];

    this.projects$ = this.searchStream$.pipe(
      // debounceTime(200), //FIX
      distinctUntilChanged(),
      startWith(""),
      switchMap((query) => {
        return this.projectService.getProjectsByFilter(query)
      })
    );
  }

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
}
