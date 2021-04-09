import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { User, UserService } from 'src/app/shared/user.service';

@Component({
    selector: 'app-generic-user-item',
    template: ``,
})
export class GenericUserItemComponent implements OnInit {

    @Input() user: User;

    constructor(
        public router: Router,
        public userService: UserService,
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
        // FIX: si può fare in entrambi i modi, qual'è il più giusto?
        // .then(toastEl => toastEl.present());
        toast.present();
    }

}
