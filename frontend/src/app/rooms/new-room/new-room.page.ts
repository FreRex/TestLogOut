import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-new-room',
  templateUrl: './new-room.page.html',
  styleUrls: ['./new-room.page.scss'],
})
export class NewRoomPage implements OnInit {

  form: FormGroup;
  creator: string;

  constructor(
    private navController: NavController,
    private roomsService: RoomService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.creator = this.authService.user;
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      nome_progetto: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      usermobile: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(12)]
      }),
      nome_collaudatore: new FormControl(this.creator ? this.creator : null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
    });
  }

  onCreateRoom() {
    this.roomsService
      .addRoom(
        Math.floor((Math.random() * 2000) + 1), // <-- Return a random number between 1 and 2000
        this.form.value.usermobile,
        this.form.value.nome_progetto,
        this.form.value.nome_collaudatore)
      .subscribe(res => {
        this.presentToast();
        this.form.reset();
        this.navController.navigateBack(['/rooms']);
      });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Room creata!',
      color: 'secondary',
      duration: 2000
    });
    toast.present();
  }
}

