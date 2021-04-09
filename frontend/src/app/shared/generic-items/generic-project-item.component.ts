import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Project, ProjectService } from 'src/app/shared/project.service';
import { EditProjectModalComponent } from '../modals/edit-project-modal/edit-project-modal.component';

@Component({
    selector: 'app-generic-project-item',
    template: ``,
})
export class GenericProjectItemComponent implements OnInit {

    @Input() project: Project;

    constructor(
        public router: Router,
        public projectService: ProjectService,
        public authService: AuthService,
        public alertController: AlertController,
        public modalController: ModalController,
        public toastController: ToastController
    ) { }
    ngOnInit() { }

    createLinkNPerf(lat, lng) {
        window.open("https://www.nperf.com/it/map/IT/-/230.TIM/signal/?ll=" + lat + "&lg=" + lng + "&zoom=13");
    }
    editProject() {
        this.modalController
            .create({
                component: EditProjectModalComponent,
                componentProps: { projectId: this.project.idprogetto }
            }).then((modalEl) => {
                modalEl.present();
                return modalEl.onDidDismiss();
            }).then(res =>
                this.presentToast('Progetto Aggiornato', 'secondary')
            );
    }
    deleteProject() {
        this.alertController.create(
            {
                header: 'Sei sicuro?',
                message: "Vuoi davvero cancellare il progetto?",
                buttons: [{ text: 'Annulla', role: 'cancel' },
                {
                    text: 'Elimina',
                    handler: () =>
                        this.projectService.deleteProject(this.project.idprogetto)
                            .subscribe(res => this.presentToast('Progetto Eliminato', 'secondary'))
                }]
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
