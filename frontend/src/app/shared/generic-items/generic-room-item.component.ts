import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonItemSliding, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { EditRoomModalComponent } from '../modals/edit-room-modal/edit-room-modal.component';
import { Room, RoomService } from '../../rooms/room.service';

@Component({
  selector: 'app-generic-room-item',
  template: ``,
})
export class GenericRoomItemComponent implements OnInit {

  @Input() room: Room;
  linkProgetto: string;
  isFavourite: boolean;

  constructor(
    public router: Router,
    public roomsService: RoomService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController
  ) { }

  ngOnInit() { }

  /** Apre il modale di MODIFICA ROOM */
  editRoom(room?: Room, slidingItem?: IonItemSliding) {
    console.log(room);


    if (slidingItem) slidingItem.close();
    if (room) this.room = room;

    this.modalController
      .create({
        component: EditRoomModalComponent,
        backdropDismiss: false,
        cssClass: 'test-custom-modal-css',
        componentProps: { roomId: this.room.id }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(res => {
        this.presentToast('Room Aggiornata', 'secondary');
      });
  }

  enterRoom(room?: Room, slidingItem?: IonItemSliding) {
    if (slidingItem) slidingItem.close();
    if (room) this.room = room;

    this.linkProgetto =
      'https://www.collaudolive.com:9777/glasses_test/FrontEnd/src/index.php?q='
      + this.room.projectID
      + ((this.authService.currentRole === 'admin') ? '&useringresso=admin' : '');
    window.open(this.linkProgetto);
  }

  copyLink(room?: Room, slidingItem?: IonItemSliding) {
    if (slidingItem) slidingItem.close();
    if (room) this.room = room;

    console.log('link copiato');
  }

  downloadFoto(room?: Room, slidingItem?: IonItemSliding) {
    if (slidingItem) slidingItem.close();
    if (room) this.room = room;

    const nomeProgetto = this.room.nome_progetto.trim().replace(' ', '');
    this.roomsService.checkDownload(nomeProgetto).subscribe(
      (value: boolean) => {
        if (value) window.open(`https://www.collaudolive.com:9083/downloadzip/${nomeProgetto}`)
        else this.presentToast(`Non ci sono foto sul progetto ${nomeProgetto}!`, 'danger')

      }
    )
  }

  deleteRoom(room?: Room, slidingItem?: IonItemSliding) {
    if (slidingItem) slidingItem.close();
    if (room) this.room = room;

    this.alertController.create(
      {
        header: 'Sei sicuro?',
        message: 'Vuoi davvero cancellare il progetto?',
        buttons: [{ text: 'Annulla', role: 'cancel' },
        {
          text: 'Elimina',
          handler: () =>
            this.roomsService.deleteRoom(this.room.id)
              .subscribe(res => this.presentToast('Room Eliminata', 'secondary'))
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
    // FIX: si può fare in entrambi i modi, qual'è il più giusto?
    // .then(toastEl => toastEl.present());
    toast.present();
  }

  onFavoutite() {
    console.log("My favourite room!");
    this.isFavourite = !this.isFavourite;
  }

}
