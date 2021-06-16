import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Foto, MediaService } from '../media.service';

@Component({
  selector: 'app-photo-details',
  templateUrl: './photo-details.component.html',
  styleUrls: ['./photo-details.component.scss'],
})
export class PhotoDetailsComponent implements OnInit {
  @Input() foto: Foto;
  @Input() roomName: string;

  inputArea: boolean = false;
  mapDisplay: boolean = false;

  constructor(
    public modalController: ModalController,
    private fb: FormBuilder,
    private mediaService: MediaService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.form.patchValue({
      nome: this.foto.nomelemento,
      note: this.foto.noteimg,
    });
  }

  form: FormGroup = this.fb.group({
    nome: [null, [Validators.required]],
    note: [null, [Validators.required]],
  });

  mapActivate() {
    if (this.mapDisplay == true) {
      this.mapDisplay = false;
      console.log('mappa off');
    } else {
      this.mapDisplay = true;
      console.log('mappa on');
    }
  }

  dowloadSinglePhoto() {
    const link = document.createElement('a');

    link.setAttribute('href', `data:image/jpeg;base64,${this.foto.imageBase64}`);
    link.setAttribute('download', `${this.foto.nomelemento}.jpeg`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  updateOn() {
    this.inputArea = true;
  }
  updateOff() {
    this.inputArea = false;

    /* chiamata UPDATE FOTO */

    this.mediaService
      .updateFoto(this.foto.idPhoto, this.form.value.nome, this.form.value.note)
      .subscribe(
        /** Il server risponde con 200 */

        (res) => {
          // non ci sono errori
          console.log('chiamata update:', res);
          if (res['affectedRows'] === 1) {
            const foto = this.mediaService.fotoSetSubject
              .getValue()
              .find((ph) => ph.idPhoto === this.foto.idPhoto);
            foto.nomelemento = this.form.value.nome;
            foto.noteimg = this.form.value.note;
            this.form.reset();
            this.modalController.dismiss({ message: 'Foto Aggiornata' }, 'ok');
          }
          // possibili errori
          else {
            console.log('chiamata update fallita:', res);
            this.form.reset();
            this.modalController.dismiss({ message: res['message'] }, 'error');
          }
        },
        /** Il server risponde con un errore */
        (err) => {
          console.log('chiamata update errore:', err);
          this.form.reset();
          this.modalController.dismiss({ message: err.error['text'] }, 'error');
        }
      );
    // this.presentToast('Room Aggiornata', 'secondary');
  }

  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }

  deleteFoto(fotoID) {
    this.alertController
      .create({
        header: 'Sei sicuro?',
        message: 'Vuoi davvero cancellare la Foto?',
        buttons: [
          { text: 'Annulla', role: 'cancel' },
          {
            text: 'Elimina',
            handler: () =>
              this.mediaService.deleteFoto(fotoID).subscribe((res) => {
                this.presentToast('Foto Eliminata', 'secondary');
                this.closeModal();
                this.modalController.dismiss({ message: 'ok' }, 'Foto cancellata');
              }),
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  async presentToast(message: string, color?: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      color: color ? color : 'secondary',
      duration: duration ? duration : 2000,
      cssClass: 'custom-toast',
    });
    toast.present();
  }
}
