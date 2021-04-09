import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { GisfoSyncModalComponent } from 'src/app/shared/modals/gisfo-sync-modal/gisfo-sync-modal.component';
import { ProjectService } from 'src/app/shared/project.service';
import { UploadShpModalComponent } from 'src/app/shared/modals/upload-shp-modal/upload-shp-modal.component';
import { GenericListComponent } from '../generic-list.component';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
})
export class ProjectsListComponent extends GenericListComponent {

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
