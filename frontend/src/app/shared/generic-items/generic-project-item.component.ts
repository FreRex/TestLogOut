import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonItemSliding, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Project, ProjectService } from 'src/app/shared/project.service';
import { EditProjectModalComponent } from '../modals/edit-project-modal/edit-project-modal.component';
import { GisfoSyncModalComponent } from '../modals/gisfo-sync-modal/gisfo-sync-modal.component';
import { UploadShpModalComponent } from '../modals/upload-shp-modal/upload-shp-modal.component';

@Component({
  selector: 'app-generic-project-item',
  template: ``,
})
export class GenericProjectItemComponent implements OnInit {

  @Input() proj: Project;

  constructor(
    public router: Router,
    public projectService: ProjectService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController
  ) { }

  ngOnInit() { }

  doRefresh(event) {
    this.projectService.loadProjects().subscribe(res => { event.target.complete(); });
  }

  createProjectAuto() {
    this.modalController
      .create({
        component: GisfoSyncModalComponent,
        backdropDismiss: false,
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
  }

  createProjectManual() {
    this.modalController
      .create({
        component: UploadShpModalComponent,
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      });
  }

  createLinkNPerf(project?: Project, slidingItem?: IonItemSliding) {
    if (slidingItem) { slidingItem.close(); }
    if (project) { this.proj = project; }

    window.open("https://www.nperf.com/it/map/IT/-/230.TIM/signal/?ll="
      + this.proj.lat_centro_map + "&lg="
      + this.proj.long_centro_map + "&zoom=13");
  }

  editProject(project?: Project, slidingItem?: IonItemSliding) {
    if (slidingItem) { slidingItem.close(); }
    if (project) { this.proj = project; }

    this.modalController
      .create({
        component: EditProjectModalComponent,
        componentProps: { projectId: this.proj.idprogetto }
      }).then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      }).then(res => {
        this.presentToast('Progetto Aggiornato', 'secondary');
      });
  }

  deleteProject(project?: Project, slidingItem?: IonItemSliding) {
    if (slidingItem) { slidingItem.close(); }
    if (project) { this.proj = project; }

    this.alertController.create(
      {
        header: 'Sei sicuro?',
        message: "Vuoi davvero cancellare il progetto?",
        buttons: [
          { text: 'Annulla', role: 'cancel' },
          {
            text: 'Elimina',
            handler: () =>
              this.projectService.deleteProject(this.proj.idprogetto)
                .subscribe(res => this.presentToast('Progetto Eliminato', 'secondary'))
          }
        ]
      }
    ).then(alertEl => { alertEl.present(); });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: 2000,
      buttons: [{ icon: 'close', role: 'cancel' }]
    })
    // .then(toastEl => toastEl.present());
    toast.present();
  }
}
