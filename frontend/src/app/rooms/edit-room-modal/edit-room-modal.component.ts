import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Room, RoomService } from '../room.service';

@Component({
  template: ''
  // selector: 'app-edit-room-modal',
  // templateUrl: './edit-room-modal.component.html',
  // styleUrls: ['./edit-room-modal.component.scss'],
})
export class EditRoomModalComponent implements OnInit, OnDestroy {
  private sub: Subscription;

  room: Room;
  roomId: number;
  isEditMode: boolean;

  constructor(
    private modalController: ModalController,
    private roomsService: RoomService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    // this.room = this.roomsService.getRoomById(this.roomId);
    
    // mi sottoscrivo all'osservabile "getRoom()" che restituisce una singola room per ID
    this.sub = this.roomsService.getRoom(this.roomId).subscribe(
      (room: Room) => { this.room = room; }
    );
  }

  ngOnDestroy() {
    if(this.sub) { this.sub.unsubscribe; }
  }

  onCancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  onDownload() {
    // TODO: logica download foto
    console.log("Foto scaricate");
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.room.nome_progetto = form.value.progetto;
    this.room.usermobile = form.value.usermobile;
    this.room.nome_collaudatore = form.value.collaudatore;

    if (this.isEditMode) {
      // this.roomsService.saveRoom(this.room);
      this.modalController.dismiss({ message: 'room saved' }, 'save');
    } else {
      // this.roomsService.createRoom(this.room);
      this.modalController.dismiss({ message: 'room created' }, 'create');
    }
    console.log("Progetto salvato");
  }

  onDelete() {
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
              this.roomsService.deleteRoom(this.room.usermobile);
              this.modalController.dismiss({ message: 'room deleted' }, 'delete');
            }
          }
        ]
      }
    ).then(alertEl => { alertEl.present(); });
  }
}
