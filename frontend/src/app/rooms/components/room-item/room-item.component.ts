import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonItemSliding, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { EditRoomModalComponent } from '../edit-room-modal/edit-room-modal.component';
import { Room, RoomService } from '../../room.service';

@Component({
  selector: 'app-room-item',
  templateUrl: './room-item.component.html',
  styleUrls: ['./room-item.component.scss'],
})
export class RoomItemComponent implements OnInit {

  @Input() room: Room;
  linkProgetto: string;
  isFavourite: boolean;

  constructor(
    private router: Router,
    private roomsService: RoomService,
    private authService: AuthService,
    private alertController: AlertController,
    private modalController: ModalController,
    private toastController: ToastController
  ) { }


  ngOnInit() {
    // console.log(this.room);
  }

  /** Apre la pagina di MODIFICA ROOM */
  onOpenEditRoomPage(slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'rooms', 'edit', this.room.id]);
  }

  /** Apre il modale di MODIFICA ROOM */
  onOpenEditRoomModal(slidingItem: IonItemSliding) {
    slidingItem.close();
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
      .then(resultData => {
        console.log(resultData.data, resultData.role);
      });
  }

  onOpenRoom() {
    this.linkProgetto =
      'https://www.collaudolive.com:9777/glasses_test/FrontEnd/src/index.php?q='
      + this.room.projectID
      + ((this.authService.currentRole === 'admin') ? '&useringresso=admin' : '');
    window.open(this.linkProgetto);
  }

  onDownload(slidingItem: IonItemSliding) {
    // TODO: logica download foto
    slidingItem.close();
    const nomeProgetto = this.room.nome_progetto.trim().replace(' ', '');
    this.roomsService.checkDownload(nomeProgetto).subscribe(
      (value: boolean) => {
        if (value) window.open(`https://www.collaudolive.com:9083/downloadzip/${nomeProgetto}`)
        else this.presentToast(`Non ci sono foto sul progetto ${nomeProgetto}!`, 'danger')

      }
    )
  }

  onDelete(slidingItem: IonItemSliding) {
    slidingItem.close();
    this.alertController.create(
      {
        header: 'Sei sicuro?',
        message: 'Vuoi davvero cancellare il progetto?',
        buttons: [
          {
            text: 'Annulla',
            role: 'cancel'
          },
          {
            text: 'Elimina',
            handler: () => {
              this.roomsService.deleteRoom(this.room.id).subscribe(res => {
                this.presentToast('Room Eliminata', 'secondary');
              });
            }
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
    // FIX: si può fare in entrambi i modi, qual'è il più giusto?
    // .then(toastEl => toastEl.present());
    toast.present();
  }

  onFavoutite() {
    console.log("My favourite room!");
    this.isFavourite = !this.isFavourite;
  }
}