import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Room, RoomService } from '../room.service';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.page.html',
  styleUrls: ['./edit-room.page.scss'],
})
export class EditRoomPage implements OnInit, OnDestroy {
  private sub: Subscription;

  form: FormGroup;
  room: Room;
  roomId: string;

  constructor(
    private activatedRouter: ActivatedRoute,
    private navController: NavController,
    private roomsService: RoomService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.createForm();

    // FIXME: si rompe inserendo a mano l'indirizzo http://localhost:8100/rooms/edit
    this.activatedRouter.paramMap.subscribe(paramMap => {
      if (!paramMap.has('roomId')) {
        this.navController.navigateBack(['/rooms']);
        return;
      }
      const roomId = +paramMap.get('roomId');

      // mi sottoscrivo all'osservabile "getRoom()" che restituisce una singola room per ID
      this.sub = this.roomsService.getRoom(roomId).subscribe(
        (room: Room) => { this.room = room; }
      );

      this.form.patchValue({
        usermobile: this.room.usermobile,
        nome_progetto: this.room.nome_progetto,
        nome_collaudatore: this.room.nome_collaudatore,
      });
    });
  }

  ngOnDestroy() {
    if(this.sub) { this.sub.unsubscribe; }
  }
  
  createForm() {
    this.form = new FormGroup({
      usermobile: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(12)]
      }),
    });
  }

  onCancel() {
    this.navController.navigateBack(['/rooms']);
  }

  onDownload() {
    // TODO: logica download foto
    console.log("Foto scaricate");
  }

  onUpdateRoom() {
    if (!this.form.valid) { return; }
    this.roomsService
    .updateRoom(this.room.id, this.form.value.usermobile)
    .subscribe(res => {
        this.presentToast('Room Aggiornata!');
        this.form.reset();
        this.navController.navigateBack(['/rooms']);
      }
    );
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      color: 'secondary',
      duration: 2000
    });
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
                this.navController.navigateBack(['/rooms']);
              });
            }
          }
        ]
      }
    ).then(alertEl => { alertEl.present(); });
  }
}
