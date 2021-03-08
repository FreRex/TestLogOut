import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Room } from '../room.model';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.page.html',
  styleUrls: ['./room-detail.page.scss'],
})
export class RoomDetailPage implements OnInit {

  loadedRoom: Room;

  constructor(
    private activatedRouter: ActivatedRoute,
    private roomsService: RoomService,
    private alertController: AlertController,
    private navController:  NavController,
  ) { }

  ngOnInit() {
    this.activatedRouter.paramMap.subscribe(paramMap => {
      if (!paramMap.has('roomId')) {
        this.navController.navigateBack(['/rooms']);
        return;
      }
      const roomId = paramMap.get('roomId');
      this.loadedRoom = this.roomsService.getRoomById(roomId);
    });
  }

  // onEditRoom() {
  //   this.modalController
  //     .create({
  //       component: EditRoomModalComponent,
  //       componentProps: {
  //         roomId: this.loadedRoom.usermobile,
  //         isEditMode: true
  //       }
  //     })
  //     .then(modalEl => { modalEl.present(); });
  // }

  onDeleteRoom() {
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
              this.roomsService.deleteRoom(this.loadedRoom.usermobile);
              this.navController.navigateBack(['/rooms']);
            }
          }
        ]
      }
    ).then(alertEl => { alertEl.present(); });
  }

}
