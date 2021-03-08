import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GisfoSyncModalComponent } from './gisfo-sync-modal/gisfo-sync-modal.component';
import { Proj } from './proj.model';
import { ProjService, User } from './proj.service';
import { SIZE_TO_MEDIA } from '@ionic/core/dist/collection/utils/media'

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.page.html',
  styleUrls: ['./backoffice.page.scss'],
})
export class BackofficePage implements OnInit {

  shpProjects:Proj[];
  users:User[];
  showProjects:boolean = true;

  constructor(
    private projService: ProjService,
    private modalCtrl: ModalController
    ) {}

  ngOnInit() {

    this.projService.fetchProjects().subscribe(
      res => {
        this.reloadProj();
      }
    );
  }

  onDelete(){
    console.log("progetto eliminato");
  }

  reloadProj(){
    this.shpProjects = this.projService.getProjects();
  }

  openGisfoUpload() {
    this.modalCtrl
      .create({
        component: GisfoSyncModalComponent,
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
      });
  }

  showProjectsClick(){
    this.showProjects = true;
  }
  showUsers(){
    this.showProjects = false;
    this.projService.fetchUsers().subscribe(
      users => this.users = users
    );
  }

  toggleMenu() {
    const splitPane = document.querySelector('ion-split-pane')
    if (window.matchMedia(SIZE_TO_MEDIA[splitPane.when] || splitPane.when).matches) {
      splitPane.classList.toggle('split-pane-visible');
    }
  }
}
