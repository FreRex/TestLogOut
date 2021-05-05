import { Component, Injectable, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonItemSliding, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Project, ProjectService } from 'src/app/admin/projects-tab/project.service';
import { EditProjectModalComponent } from './edit-project-modal/edit-project-modal.component';
import { CreateProjectModalComponent } from './create-project-modal/create-project-modal.component';
import { DashboardService } from '../dashboard/dashboard.service';
import { forkJoin } from 'rxjs';

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
    public toastController: ToastController,
    public dashService: DashboardService,
    public loadingController: LoadingController,

  ) { }

  ngOnInit() { }

  doRefresh(event) {
    this.projectService.loadProjects().subscribe(res => { event.target.complete(); });
  }

  syncProjectUpdate(project?: Project, slidingItem?: IonItemSliding) {
    if (slidingItem) { slidingItem.close(); }
    if (project) { this.proj = project; }

    this.toastController.create({
      message: 'Sincronizzazione in corso...',
      position: 'bottom',
      cssClass: 'sync-toast',
      color: 'secondary'
    }).then(toastEl => {
      toastEl.present();
      this.dashService.sincroDb(
        this.proj.collaudatoreufficio,
        this.proj.pk_proj
      ).subscribe(res => {
        console.log('sincroended: ', res);
        toastEl.dismiss();
        // TODO: ricaricamento dati o solo aggiornamento datasync frontend
        this.reloadData();
      });
      return toastEl.onDidDismiss();
    });
  }

  reloadData() {
    this.loadingController
      .create({ keyboardClose: true, message: 'Loading...' })
      .then(loadingEl => {
        loadingEl.present();
        forkJoin({
          requestProjects: this.projectService.loadProjects(),
        }).subscribe(({ requestProjects }) => {
          loadingEl.dismiss();
        });
      });
  }

  createProject() {
    this.modalController
      .create({
        component: CreateProjectModalComponent,
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      }).then(res => {
        if (res.role === 'ok') {
          this.presentToast(res.data['message'], 'secondary');
        } else if (res.role === 'error') {
          this.presentToast(`Aggiornamento fallito.\n ${res.data['message']}`, 'danger', 5000);
        }
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
        if (res.role === 'ok') {
          this.presentToast(res.data['message'], 'secondary');
        } else if (res.role === 'error') {
          this.presentToast(`Aggiornamento fallito.\n ${res.data['message']}`, 'danger', 5000);
        }
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

  async presentToast(message: string, color?: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      color: color ? color : 'secondary',
      duration: duration ? duration : 2000,
      cssClass: 'custom-toast',
    })
    // FIX: si può fare in entrambi i modi, qual'è il più giusto?
    // .then(toastEl => toastEl.present());
    toast.present();
  }
}
