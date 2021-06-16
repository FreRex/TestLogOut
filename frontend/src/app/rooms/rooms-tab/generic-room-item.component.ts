import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { AlertController, IonItemSliding, ModalController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

import { Room, RoomService } from '../room.service';
import { CreateRoomModalComponent } from './create-room-modal/create-room-modal.component';
import { EditRoomModalComponent } from './edit-room-modal/edit-room-modal.component';

@Component({
  selector: 'app-generic-room-item',
  template: ``,
})
export class GenericRoomItemComponent implements OnInit {
  @Input() room: Room;
  isFavourite: boolean;
  baseUrl =
    'https://www.collaudolive.com:9777/glasses/FrontEnd/src/index.php?q=';
  linkProgetto: string;

  constructor(
    public router: Router,
    public navController: NavController,
    public roomService: RoomService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController
  ) {}

  ngOnInit() {}

  doRefresh(event) {
    this.roomService.loadRooms().subscribe((res) => {
      event.target.complete();
    });
  }

  /** Apre il modale di CREAZIONE ROOM */
  createRoom() {
    this.modalController
      .create({
        component: CreateRoomModalComponent,
        backdropDismiss: false,
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((res) => {
        if (res.role === 'ok') {
          this.presentToast(res.data['message'], 'secondary');
        } else if (res.role === 'error') {
          this.presentToast(
            `Aggiornamento fallito.\n ${res.data['message']}`,
            'danger',
            5000
          );
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
        componentProps: { roomId: this.room.id },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((res) => {
        if (res.role === 'ok') {
          this.presentToast(res.data['message'], 'secondary');
        } else if (res.role === 'error') {
          this.presentToast(
            `Aggiornamento fallito.\n${res.data['message']}`,
            'danger',
            5000
          );
        }
      });
  }

  /** Crea un alert per la cancellazione della ROOM */
  deleteRoom(room?: Room, slidingItem?: IonItemSliding) {
    if (slidingItem) slidingItem.close();
    if (room) this.room = room;

    this.alertController
      .create({
        header: 'Sei sicuro?',
        message: 'Vuoi davvero cancellare il progetto?',
        buttons: [
          { text: 'Annulla', role: 'cancel' },
          {
            text: 'Elimina',
            handler: () =>
              this.roomService
                .deleteRoom(this.room.id)
                .subscribe((res) =>
                  this.presentToast('Room Eliminata', 'secondary')
                ),
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  /** Apre il link della ROOM */
  // enterRoom(room?: Room, slidingItem?: IonItemSliding) {
  //   if (slidingItem) slidingItem.close();
  //   if (room) this.room = room;

  //   this.authService.currentUser$.pipe(take(1)).subscribe((currentUser) => {
  //     this.linkProgetto =
  //       this.baseUrl +
  //       this.room.pk_project +
  //       (currentUser.autorizzazione === 'admin' ? '&useringresso=admin' : '');
  //   });

  //   // window.open(this.linkProgetto);

  //   const link = document.createElement('a');
  //   link.setAttribute('target', '_blank');
  //   link.setAttribute('href', this.linkProgetto);
  //   document.body.appendChild(link);
  //   link.click();
  //   link.remove();
  // }

  /** Entra nella ROOM */
  enterRoom(room?: Room, slidingItem?: IonItemSliding) {
    if (slidingItem) slidingItem.close();
    if (room) this.room = room;
    // this.router.navigate([`/conference/${this.room.id}`], {
    //   queryParams: { room: this.room.id },
    // });

    // this.router.navigate([`/conference`], {
    //   queryParams: {
    //     roomId: encodeURIComponent(this.room.id),
    //     session: encodeURIComponent(this.room.sessione),
    //     project: encodeURIComponent(this.room.progetto),
    //     creator: encodeURIComponent(this.room.collaudatore),
    //   },
    // });

    /* 
    * Potrei passare dal servizio
    * Definire una currentRoom Osservabile
    * Selezionarla nel momento in cui clicco il pulsante
    * E recuperarla all'apertura della pagina 
    ! ATTENZIONE a mantenere tutti i dati sul localStorage???
    */
    Storage.set({
      key: 'roomData',
      value: JSON.stringify({
        roomId: this.room.id,
      }),
    });

    this.router.navigate([`/conference`]);
  }

  /** Copia il link della ROOM */
  copyLink(room?: Room, slidingItem?: IonItemSliding) {
    if (slidingItem) slidingItem.close();
    if (room) this.room = room;

    const params = new URLSearchParams({
      roomId: encodeURIComponent(this.room.id),
      session: encodeURIComponent(this.room.sessione),
      project: encodeURIComponent(this.room.progetto),
      creator: encodeURIComponent(this.room.collaudatore),
    });

    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData(
        'text/plain',
        `${environment.app}/conference?${params}`
      );
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this.presentToast('Link copiato.', 'secondary');
  }

  // copyLink(room?: Room, slidingItem?: IonItemSliding) {
  //   if (slidingItem) slidingItem.close();
  //   if (room) this.room = room;

  //   document.addEventListener('copy', (e: ClipboardEvent) => {
  //     e.clipboardData.setData(
  //       'text/plain',
  //       this.baseUrl + this.room.pk_project
  //     );
  //     e.preventDefault();
  //     document.removeEventListener('copy', null);
  //   });
  //   document.execCommand('copy');
  //   this.presentToast('Link copiato.', 'secondary');
  // }

  /** Avvia il download delle foto della ROOM */
  downloadFoto(room?: Room, slidingItem?: IonItemSliding) {
    if (slidingItem) slidingItem.close();
    if (room) this.room = room;

    const nomeProgetto = this.room.progetto.trim().replace(' ', '');
    this.roomService.checkDownload(nomeProgetto).subscribe((value: boolean) => {
      if (value) {
        const link = document.createElement('a');
        //link.setAttribute('target', '_blank');
        //link.setAttribute('href', `https://www.collaudolive.com:9083/downloadzip/${nomeProgetto}`);
        link.setAttribute(
          'href',
          `${environment.apiUrl}/downloadzip/${nomeProgetto}`
        );
        link.setAttribute('download', `${nomeProgetto}.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        this.presentToast(
          `Non ci sono foto sul progetto ${nomeProgetto}!`,
          'danger'
        );
      }
      //window.open(`https://www.collaudolive.com:9083/downloadzip/${nomeProgetto}`)
    });

    /** window.open */
    // const nomeProgetto = this.room.progetto.trim().replace(' ', '');
    // this.roomService.checkDownload(nomeProgetto).subscribe(
    //   (value: boolean) => {
    //     if (value) window.open(`https://www.collaudolive.com:9083/downloadzip/${nomeProgetto}`)
    //     else this.presentToast(`Non ci sono foto sul progetto ${nomeProgetto}!`, 'danger')
    //   }
    // )

    /** Metodo Josuè */
    // this.toastController.create({
    //   message: 'Download foto in corso...',
    //   position: 'bottom',
    //   cssClass: 'download-toast',
    //   color: 'secondary'
    // }).then(toastEl => {
    //   toastEl.present();
    // const nomeProgetto = this.room.progetto.trim().replace(' ', '');
    // this.roomService.downloadFoto(nomeProgetto).subscribe(
    //   (result: any) => { //when you use stricter type checking
    //     if (result.type === HttpEventType.DownloadProgress) {
    //       const percentDone = Math.round(100 * result.loaded / result.total);
    //       console.log(percentDone);
    //     }
    //     if (result.type === HttpEventType.Response) {
    //       const blob = new Blob([result], { type: 'application/zip' });
    //       fileSaver.saveAs(blob, `${nomeProgetto}.zip`);
    //       toastEl.dismiss();
    //     }
    //   });
    // })
  }

  async presentToast(message: string, color?: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      color: color ? color : 'secondary',
      duration: duration ? duration : 2000,
      cssClass: 'custom-toast',
    });
    // FIX: si può fare in entrambi i modi, qual'è il più giusto?
    // .then(toastEl => toastEl.present());
    toast.present();
  }

  onFavoutite() {
    console.log('My favourite room!');
    this.isFavourite = !this.isFavourite;
  }
}
