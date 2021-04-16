import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { AlertController, IonItemSliding, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { EditRoomModalComponent } from '../modals/edit-room-modal/edit-room-modal.component';
import { Room, RoomService } from '../../rooms/room.service';
import { NewRoomModalComponent } from '../modals/new-room-modal/new-room-modal.component';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-generic-room-item',
  template: ``,
})
export class GenericRoomItemComponent implements OnInit {

  @Input() room: Room;
  isFavourite: boolean;
  baseUrl = 'https://www.collaudolive.com:9777/glasses_test/FrontEnd/src/index.php?q=';

  constructor(
    public router: Router,
    public roomService: RoomService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController
  ) { }

  ngOnInit() { }

  doRefresh(event) {
    this.roomService.loadRooms().subscribe(res => { event.target.complete(); });
  }

  /** Apre il modale di CREAZIONE ROOM */
  createRoom() {
    this.modalController
      .create({
        component: NewRoomModalComponent,
        backdropDismiss: false,
      })
      .then(modalEl => {
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

  /** Apre il modale di MODIFICA ROOM */
  editRoom(room?: Room, slidingItem?: IonItemSliding) {
    if (slidingItem) slidingItem.close();
    if (room) this.room = room;

    this.modalController
      .create({
        component: EditRoomModalComponent,
        backdropDismiss: false,
        componentProps: { roomId: this.room.id }
      }).then(modalEl => {
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

  /** Apre il link della ROOM */
  enterRoom(room?: Room, slidingItem?: IonItemSliding) {
    if (slidingItem) slidingItem.close();
    if (room) this.room = room;

    const linkProgetto = this.baseUrl + this.room.projectID + ((this.authService.currentRole === 'admin') ? '&useringresso=admin' : '');
    window.open(linkProgetto);
  }

  /** Copia il link della ROOM */
  copyLink(room?: Room, slidingItem?: IonItemSliding) {
    if (slidingItem) slidingItem.close();
    if (room) this.room = room;

    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (this.baseUrl + this.room.projectID));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this.presentToast('Link copiato.', 'secondary');
  }

  /** Avvia il download delle foto della ROOM */
  downloadFoto(room?: Room, slidingItem?: IonItemSliding) {
    if (slidingItem) slidingItem.close();
    if (room) this.room = room;

    this.toastController.create({
      message: 'Download foto in corso...',
      position: 'bottom',
      cssClass: 'download-toast',
      color: 'secondary'
    }).then(toastEl => {
      toastEl.present();
      const nomeProgetto = this.room.nome_progetto.trim().replace(' ', '');
      this.roomService.downloadFoto(nomeProgetto).subscribe(
        (result: any) => { //when you use stricter type checking
          if (result.type === HttpEventType.DownloadProgress) {
            const percentDone = Math.round(100 * result.loaded / result.total);
            console.log(percentDone);
          }
          if (result.type === HttpEventType.Response) {
            const blob = new Blob([result], { type: 'application/zip' });
            fileSaver.saveAs(blob, `${nomeProgetto}.zip`);
            toastEl.dismiss();
          }
        });
    })

    //   let blob: any = new Blob([response], { type: 'text/json; charset=utf-8' });
    //   const url = window.URL.createObjectURL(blob);
    //   window.open(url);
    //   window.location.href = response.url;
    //   fileSaver.saveAs(blob, nomeProgetto);
    //   console.log(blob, 'TEST ZIP')
    //   console.log(url, 'test zip')
    //   //}), error => console.log('Error downloading the file'),        
    // }),
    // (error: any) => console.log('Error downloading the file'),  //when you use stricter type checking 
    // () => console.info('File downloaded successfully');

    // this.roomService.checkDownload(nomeProgetto).subscribe(
    //   (value: boolean) => {
    //     if (value) window.open(`https://www.collaudolive.com:9083/downloadzip/${nomeProgetto}`)
    //     else this.presentToast(`Non ci sono foto sul progetto ${nomeProgetto}!`, 'danger')
    //   }
    // )
  }

  /** Crea un alert per la cancellazione della ROOM */
  deleteRoom(room?: Room, slidingItem?: IonItemSliding) {
    if (slidingItem) slidingItem.close();
    if (room) this.room = room;

    this.alertController.create(
      {
        header: 'Sei sicuro?',
        message: 'Vuoi davvero cancellare il progetto?',
        buttons: [
          { text: 'Annulla', role: 'cancel' },
          {
            text: 'Elimina',
            handler: () =>
              this.roomService.deleteRoom(this.room.id)
                .subscribe(res => this.presentToast('Room Eliminata', 'secondary'))
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

  onFavoutite() {
    console.log("My favourite room!");
    this.isFavourite = !this.isFavourite;
  }

}
