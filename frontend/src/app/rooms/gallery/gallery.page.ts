import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IonContent, Platform, ModalController, ToastController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Check, Foto, MediaService } from './media.service';
import { PhotoDetailsComponent } from './photo-details/photo-details.component';

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
  public pageNum: number = 1;
  backToTop: boolean = false;

  @ViewChild(IonContent) content: IonContent;

  constructor(
    private mediaServ: MediaService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    public router: Router,
    public modalController: ModalController,
    public platform: Platform

  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((pM: ParamMap) => {
      this.roomId = pM.get('id');
      this.roomName = pM.get('proj');
      console.log(this.roomId);
      console.log(this.roomName);
      this.mediaServ.loadMedia(this.roomId, this.pageNum).subscribe(
        (res:Foto[]) => {
          if (res.length == 0 ){
            this.presentToast('Non ci sono Foto')
          }else{
            this.foto.push(...res) 
          }
        },
        err =>console.log('errore', err),
        () => console.log('complete')
      );      
    });
    this.mediaServ.checkDownload(this.roomName);
  }

  loadMoreFoto(event){
    this.pageNum++;
    this.mediaServ.loadMedia(this.roomId, this.pageNum)
    .subscribe(
      (res:Foto[]) => {
        if (res.length == 0 ){
          if (event){
            event.target.complete();
            event.target.disable = true;
          }
        }else{
          this.foto.push(...res) 
          if (event){
            event.target.complete();
          }
        }
      },
      err =>console.log('errore', err),
      () => console.log('complete')
    );      
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

  async editFoto(singleFoto:Foto) {

    const modal = await this.modalController.create({
      component: PhotoDetailsComponent,
      componentProps: { foto: singleFoto }
    });
    return await modal.present();
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

  getScrollPos(pos: number) {
    if (pos > this.platform.height()) {
         this.backToTop = true;
    } else {
         this.backToTop = false;
    }
}
gotToTop() {
  this.content.scrollToTop(1000);
}
}
