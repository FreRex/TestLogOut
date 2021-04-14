import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonItemSliding, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { User, UserService } from 'src/app/shared/user.service';
import { EditUserModalComponent } from '../modals/edit-user-modal/edit-user-modal.component';

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

    editUser(slidingItem?: IonItemSliding) {
        if (slidingItem) {
            slidingItem.close();
        }
        this.modalController
            .create({
                component: EditUserModalComponent,
                componentProps: { userId: this.user.id }
            }).then((modalEl) => {
                modalEl.present();
                return modalEl.onDidDismiss();
            });/* .then(res =>
                this.presentToast('Utente Aggiornato', 'secondary')
            ); */
    }
    
    deleteUser(slidingItem?: IonItemSliding) {
        if (slidingItem) {
            slidingItem.close();
        }
        this.alertController.create({
            header: 'Sei sicuro?',
            message: "Vuoi davvero cancellare l'Utente?",
            buttons: [{ text: 'Annulla', role: 'cancel' },
            {
                text: 'Elimina',
                handler: () => this.userService.deleteUser(this.user.id)
                    .subscribe(res => this.presentToast('Utente Eliminato', 'secondary'))
            }]
        }).then(alertEl => { alertEl.present(); });
    }
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
