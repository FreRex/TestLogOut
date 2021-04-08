import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Project, ProjectService } from 'src/app/backoffice/projects/project.service';

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
