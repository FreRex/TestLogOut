import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
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
    private alertController: AlertController,
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
        this.form.value.usermobile,
        this.form.value.nome_progetto,
        this.form.value.nome_collaudatore)
      .subscribe(
        res => {
        this.presentToast();
        this.form.reset();
        this.navController.navigateBack(['/rooms']);
      },
      (err: HttpErrorResponse) => {
        console.log("Error:",err.error['text']);
        this.createErrorAlert(err.error['text']);
      }
      );
  }

  async createErrorAlert(error: string) {
    const alert = await this.alertController.create({
      header: "Errore:",
      message: error,
      buttons: [{ text: 'Annulla', role: 'cancel' },]
    });
    // FIX: si può fare in entrambi i modi, qual'è il più giusto?
    // .then(alertEl => { alertEl.present(); });
    alert.present();
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

