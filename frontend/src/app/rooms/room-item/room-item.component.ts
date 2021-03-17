import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { EditRoomModalComponent } from '../edit-room-modal/edit-room-modal.component';
import { Room } from '../room.service';

@Component({
  selector: 'app-room-item',
  templateUrl: './room-item.component.html',
  styleUrls: ['./room-item.component.scss'],
})
export class RoomItemComponent implements OnInit {

  @Input() roomItem: Room;
  isFavourite: boolean;
  
  constructor(
    private router: Router,
    private modalController: ModalController
    ) { }

  ngOnInit() {  }

  onDownload() {
    // TODO: logica download foto
    console.log("Foto scaricate");
  }

  /** Apre la pagina di MODIFICA ROOM */
  onOpenEditRoomPage(slidingItem: IonItemSliding){
    slidingItem.close();
    this.router.navigate(['/', 'rooms', 'edit', this.roomItem.id]);
  }

  /** Apre il modale di MODIFICA ROOM */
  onOpenEditRoomModal(slidingItem: IonItemSliding) {
    slidingItem.close();
    this.modalController
      .create({
        component: EditRoomModalComponent,
        backdropDismiss: false,
        cssClass: 'test-custom-modal-css',
        componentProps: { roomId: this.roomItem.id }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
      });
  }

  onFavoutite(){
    console.log("My favourite room!");
    this.isFavourite = !this.isFavourite;
  }
}