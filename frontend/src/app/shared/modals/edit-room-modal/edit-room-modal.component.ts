import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AlertController, ModalController } from '@ionic/angular';
import { Room, RoomService } from '../../../rooms/room.service';

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
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.roomsService.getRoom(this.roomId).subscribe(room => {
      this.room = room;
      this.form = new FormGroup({
        usermobile: new FormControl(this.room.usermobile, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(12)]
        })
      });
    },
    );
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
        res => {
          /** Il server risponde con 200 ma non ha fatto cambiamenti (non so se esiste come risposta)
          if(ok) this.modalController.dismiss({ message: 'room updated' }, 'ok');
          else this.modalController.dismiss(null, 'cancel');
          */
          this.form.reset();
          this.modalController.dismiss({ message: 'room updated' }, 'ok');
        },
        /** Il serrver risponde con un errore */
        err => {
          this.form.reset();
          this.modalController.dismiss({ message: err.error['text'] }, 'error');
        }
      );
    this.presentToast('Room Aggiornata', 'secondary');
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
