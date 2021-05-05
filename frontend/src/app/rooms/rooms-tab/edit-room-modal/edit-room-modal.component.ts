import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AlertController, ModalController } from '@ionic/angular';
import { Room, RoomService } from '../../room.service';

@Component({
  selector: 'app-edit-room-modal',
  templateUrl: './edit-room-modal.component.html',
  styleUrls: ['./edit-room-modal.component.scss'],
})
export class EditRoomModalComponent implements OnInit {

  @Input() roomId: number;
  form: FormGroup;
  room: Room;

  constructor(
    private roomsService: RoomService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.roomsService.getRoom(this.roomId).subscribe(room => {
      this.room = room;
      this.form = new FormGroup({
        usermobile: new FormControl(this.room.usermobile, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(30)]
        })
      });
    });
  }

  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }

  updateRoom() {
    if (!this.form.valid) { return; }
    this.roomsService
      .updateRoom(
        this.room.id,
        this.form.value.usermobile)
      .subscribe(
        /** Il server risponde con 200 */
        res => {
          // non ci sono errori
          if (res['affectedRows'] === 1) {
            this.form.reset();
            this.modalController.dismiss({ message: 'Room Aggiornata' }, 'ok');
          }
          // possibili errori
          else {
            this.form.reset();
            this.modalController.dismiss({ message: res['message'] }, 'error');
          }
        },
        /** Il server risponde con un errore */
        err => {
          this.form.reset();
          this.modalController.dismiss({ message: err.error['text'] }, 'error');
        }
      );
    // this.presentToast('Room Aggiornata', 'secondary');
  }

}
