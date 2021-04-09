import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, concat, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { GisfoSyncModalComponent } from 'src/app/shared/modals/gisfo-sync-modal/gisfo-sync-modal.component';
import { Project, ProjectService } from 'src/app/shared/project.service';
import { UploadShpModalComponent } from 'src/app/shared/modals/upload-shp-modal/upload-shp-modal.component';
import { GenericTableComponent, TableData } from '../generic-table.component';

@Component({
  selector: 'app-projects-table',
  templateUrl: './projects-table.component.html',
  styleUrls: ['./projects-table.component.scss'],
})
export class ProjectsTableComponent extends GenericTableComponent {

  datas: TableData[] = [
    { title: 'ID', key: 'idprogetto', type: 'number', size: 1 },
    { title: 'SHP', key: 'conn_edif_opta', type: 'number', size: 1 },
    { title: 'Data', key: 'datasincro', type: 'date', size: 1 },
    { title: 'PK Project', key: 'pk_proj', type: 'string', size: 2 },
    { title: 'Nome Progetto', key: 'nome', type: 'string', size: 3 },
    { title: 'Collaudatore', key: 'collaudatoreufficio', type: 'string', size: 2 },
    { title: 'Azioni', key: 'azioni', type: 'buttons', size: 2 },
  ];

  constructor(
    private projectService: ProjectService,
    private modalController: ModalController
  ) {
    super();
  }
  filterData(query: any): Observable<any[]> {
    return this.projectService.getProjectsByFilter(query);
  }
  doRefresh(event) {
    this.projectService.loadProjects().subscribe(res => { event.target.complete(); });
  }
  openGisfoUpload() {
    this.modalController
      .create({
        component: GisfoSyncModalComponent,
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
  }
  openManualUpload() {
    this.modalController
      .create({
        component: UploadShpModalComponent,
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
  }
}
