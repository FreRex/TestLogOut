import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { User, UserService } from '../user.service';

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
    private modalController: ModalController,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user;
      console.log(this.user.idutcas);

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
        autorizzazioni: new FormControl(this.user.autorizzazioni, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(30)],
        }),
      });
    });
  }

  updateUser() {
    if (!this.form.valid) { return }
    this.userService.updateUser(
      this.form.value.collaudatoreufficio,
      this.form.value.username,
      this.form.value.password,
      this.user.id,
      this.form.value.autorizzazioni
    ).subscribe(
      /** Il server risponde con 200 */
      res => {
        // non ci sono errori
        if (res['affectedRows'] === 1) {
          this.form.reset();
          this.modalController.dismiss({ message: 'Utente Aggiornato' }, 'ok');
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
  }

  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }
}
