import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
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
    private authService: AuthService,
    private alertController: AlertController,
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
      // this.room = this.roomsService.getRoomById(roomId);

      // mi sottoscrivo all'osservabile "getRoom()" che restituisce una singola room per ID
      this.sub = this.roomsService.getRoom(roomId).subscribe(
        (room: Room) => { this.room = room; }
      );

      this.form.patchValue({
        usermobile: this.room.usermobile,
        nome_progetto: this.room.nome_progetto,
        nome_collaudatore: this.room.nome_collaudatore,
        // data_inserimento: new Date(this.room.data_inserimento).toISOString(),
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
      nome_progetto: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      nome_collaudatore: new FormControl(this.authService.user, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      // data_inserimento: new FormControl(null, {
      //   updateOn: 'blur',
      //   validators: [Validators.required]
      // }),
    });
  }

  onCancel() {
    this.navController.navigateBack(['/rooms']);
  }

  onDownload() {
    // TODO: logica download foto
    console.log("Foto scaricate");
  }

  onSave() {
    if (!this.form.valid) {
      return;
    }
    this.roomsService.updateRoom(this.room.id, this.room.usermobile).subscribe(
      res => {
        this.roomsService.saveRoom(
          this.room.id,
          this.form.value.usermobile,
          this.form.value.nome_progetto,
          this.form.value.nome_collaudatore);
        this.form.reset();
        console.log("Progetto salvato");
        this.navController.navigateBack(['/rooms']);
      }
    );
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
              this.navController.navigateBack(['/rooms']);
            }
          }
        ]
      }
    ).then(alertEl => { alertEl.present(); });
  }
}
