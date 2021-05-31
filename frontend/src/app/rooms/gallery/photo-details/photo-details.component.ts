import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { RoomsPageRoutingModule } from '../../rooms-routing.module';
import { Foto, MediaService } from '../media.service';

@Component({
  selector: 'app-photo-details',
  templateUrl: './photo-details.component.html',
  styleUrls: ['./photo-details.component.scss'],
})
export class PhotoDetailsComponent implements OnInit{

  
  @Input() foto: Foto;
  @Input() roomName: string;
  

  constructor(
    public modalController: ModalController,
    private fb: FormBuilder,
    private mediaService: MediaService,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
/*     this.form.patchValue({
      nome: this.foto.nameimg,
      note: this.foto.noteimg
    }) */
    
  }

  form: FormGroup = this.fb.group({
    nome: [null, [Validators.required]],
    note: [null, [Validators.required]],
  });

  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }

  deleteFoto(fotoID) {
    console.log("questa foto: ", fotoID);
    
    this.alertController
      .create({
        header: 'Sei sicuro?',
        message: 'Vuoi davvero cancellare la Foto?',
        buttons: [
          { text: 'Annulla', role: 'cancel' },
          {
            text: 'Elimina',
            handler: () =>
            
            this.mediaService
            .deleteFoto(fotoID)
            .subscribe((res) => this.presentToast('Foto Eliminata', 'secondary'),
            
            ),
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
