import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { User, UserService } from '../../user.service';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss'],
})
export class EditUserModalComponent implements OnInit {
  form: FormGroup;
  @Input() userId: number;
  user: User;

  constructor(
    private modalCtrl: ModalController,
    private userService: UserService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user;
      this.form = new FormGroup({
        collaudatoreufficio: new FormControl(this.user.collaudatoreufficio, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(30)],
        }),
        username: new FormControl(this.user.username, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(50)],
        }),
        password: new FormControl(this.user.password, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(30)],
        }),
      });
    });
  }

  closeModal() {
    this.modalCtrl.dismiss(EditUserModalComponent);
  }

  updateUser() {
    if (!this.form.valid) {
      return
    }
    this.userService.updateUser(
      this.form.value.collaudatoreufficio,
      this.form.value.username,
      this.form.value.password,
      this.user.id
    ).subscribe(res => {
      this.presentToast("Utente Aggiornato");
      this.form.reset();
      this.closeModal();
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      color: 'secondary',
      duration: 2000,
      buttons: [{ icon: 'close', role: 'cancel' }]
    })
    toast.present();
  }
}
