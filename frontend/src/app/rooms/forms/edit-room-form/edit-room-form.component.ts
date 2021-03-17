import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Room, RoomService } from '../../room.service';

@Component({
  selector: 'edit-room-form',
  templateUrl: './edit-room-form.component.html',
  styleUrls: ['./edit-room-form.component.scss'],
})
export class EditRoomFormComponent implements OnInit {

  @Input() roomId: number;
  @Output() formEvent = new EventEmitter<string>();
  isLoading = false;
  form: FormGroup;
  room: Room;

  constructor(
    private roomsService: RoomService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    console.log(this.roomId);

    // mi sottoscrivo all'osservabile "getRoom()" che restituisce una singola room per ID
    this.isLoading = true;
    this.roomsService.getRoom(this.roomId).subscribe(
      (room: Room) => {
        this.room = room;
        this.form = new FormGroup({
          usermobile: new FormControl(this.room.usermobile, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(12)]
          })
        });
        this.isLoading = false;
      },
      error => { this.createErrorAlert('Impossibile caricare la room'); }
    );
  }

  onDownload() {
    // TODO: logica download foto
    console.log("Foto scaricate");
  }

  onUpdateRoom() {
    if (!this.form.valid) { return; }
    this.roomsService
      .updateRoom(
        this.room.id,
        this.form.value.usermobile)
      .subscribe(
        res => {
          console.log("Response", res);
          this.presentToast('Room Aggiornata!');
          this.form.reset();
          this.formEvent.emit('save');
        },
        (err: HttpErrorResponse) => {
          console.log("Error:", err.message);
          this.createErrorAlert(err.message);
        }
      );
  }

  async createErrorAlert(error: string) {
    const alert = await this.alertController.create({
      header: "Errore:",
      message: error,
      buttons: [{ text: 'Annulla', role: 'cancel' }]
    });
    // FIX: si può fare in entrambi i modi, qual'è il più giusto?
    // .then(alertEl => { alertEl.present(); });
    alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      color: 'secondary',
      duration: 2000
    })
    // FIX: si può fare in entrambi i modi, qual'è il più giusto?
    // .then(toastEl => toastEl.present());
    toast.present();
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
              this.roomsService.deleteRoom(this.room.id).subscribe(res => {
                this.presentToast('Room Eliminata');
                this.formEvent.emit('delete');
              });
            }
          }
        ]
      }
    ).then(alertEl => { alertEl.present(); });
  }

}
