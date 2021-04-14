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
    private alertController: AlertController,
    private modalController: ModalController
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
    this.modalController.dismiss(EditRoomModalComponent);
  }

  updateRoom() {
    if (!this.form.valid) { return; }
    this.roomsService
      .updateRoom(
        this.room.id,
        this.form.value.usermobile)
      .subscribe(
        res => {
          this.form.reset();
          this.closeModal();
        });
  }

}
