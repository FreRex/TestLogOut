import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Foto, MediaService } from './media.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  galleryType = 'foto';
  roomId: string;
  roomName: string;
  foto:Foto[] = [];

  constructor(
    private mediaServ: MediaService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    public router: Router,

  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((pM: ParamMap) => {
      this.roomId = pM.get('id');
      this.roomName = pM.get('proj');
      console.log(this.roomId);
      console.log(this.roomName);

      this.mediaServ.checkMedia(this.roomId)      
      .subscribe(
        (res) => {
          if (res.numeroPagine == 0){
            this.presentToast('Non ci sono Foto')
          }
        },
        err =>console.log('errore', err),
        () => console.log('complete')
      );

      this.mediaServ.loadMedia(this.roomId)
      .subscribe(
        (res:Foto[]) => {
         this.foto = res 
         console.log("SIAMO QUI: ", this.foto[0].imageBase64);
         
        },
        err =>console.log('errore', err),
        () => console.log('complete')
        
      );

    });
    this.mediaServ.checkDownload(this.roomName);
  }

  toRoomPage() {
    this.router.navigate([`/rooms`]);
  }

  downloadFoto() {
    const nomeProgetto = this.roomName.trim().replace(' ', '');
    this.mediaServ.checkDownload(nomeProgetto).subscribe((value: boolean) => {
      if (value) {
        const link = document.createElement('a');

        link.setAttribute('href', `${environment.apiUrl}/downloadzip/${nomeProgetto}`);
        link.setAttribute('download', `${nomeProgetto}.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        this.presentToast(`Non ci sono foto sul progetto ${nomeProgetto}!`, 'danger');
      }
    });
  }

  async presentToast(message: string, color?: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      color: color ? color : 'secondary',
      duration: duration ? duration : 2000,
      cssClass: 'custom-toast',
    });
    // FIX: si può fare in entrambi i modi, qual'è il più giusto?
    // .then(toastEl => toastEl.present());
    toast.present();
  }
}
