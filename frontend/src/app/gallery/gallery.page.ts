import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  IonContent,
  ModalController,
  NavController,
  Platform,
  ToastController,
  ViewWillEnter,
  ViewWillLeave,
} from '@ionic/angular';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import {
  Photo,
  MediaService,
  ERR_ZERO_PHOTOS,
  ERR_NOMORE_PHOTOS,
} from './media.service';
import { PhotoDetailsComponent } from './photo-details/photo-details.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ transform: 'scale(.1)', opacity: 0 }),
        animate('.5s ease-in', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1 }),
        animate('.5s ease-out', style({ transform: 'scale(0.1)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class GalleryPage implements ViewWillEnter, ViewWillLeave {
  galleryType = 'foto';

  roomId: string;
  roomName: string;

  pageNum: number = 1;
  numberOfPhotosXPage: number = 12;

  backToTop: boolean = false;
  isLoading: boolean = true;

  photoSet$: Observable<Photo[]>;

  @ViewChild(IonContent) content: IonContent;

  constructor(
    private mediaServ: MediaService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private navController: NavController,
    public router: Router,
    public modalController: ModalController,
    public platform: Platform
  ) {}

  ionViewWillEnter() {
    this.photoSet$ = this.mediaServ.photoSet$;
    this.activatedRoute.paramMap.subscribe((pM: ParamMap) => {
      this.roomId = pM.get('id');
      this.roomName = pM.get('proj');
      this.loadPhotos();
    });
    // this.mediaServ.checkDownload(this.roomName);
  }

  ionViewWillLeave() {
    this.mediaServ.photoSetSubject.next([]);
    this.pageNum = 1;
  }

  loadPhotos(event?) {
    this.mediaServ
      .loadPhotos(this.roomId, this.pageNum, this.numberOfPhotosXPage)
      .subscribe(
        (photoSet: Photo[]) => {
          this.isLoading = false;
          if (photoSet.length > 0) {
            this.pageNum++;
            if (event) {
              event.target.complete();
            }
          }
        },
        (err) => {
          if (err === ERR_ZERO_PHOTOS) {
            this.isLoading = false;
            this.presentToast('Non ci sono Foto');
          } else if (err === ERR_NOMORE_PHOTOS) {
            if (event) {
              event.target.complete();
              event.target.disable = true;
            }
          } else {
            console.log('🐱‍👤 : err', err);
          }
        }
      );
  }

  // loadMoreFoto(event) {
  //   this.pageNum++;
  //   this.mediaServ.loadPhotos(this.roomId, this.pageNum).subscribe(
  //     (res: Photo[]) => {
  //       if (res.length == 0) {
  //         if (event) {
  //           event.target.complete();
  //           event.target.disable = true;
  //         }
  //       } else {
  //         /* this.foto.push(...res)  */
  //         if (event) {
  //           event.target.complete();
  //         }
  //       }
  //     },
  //     (err) => console.log('errore', err),
  //     () => console.log('complete')
  //   );
  // }

  toRoomPage() {
    this.navController.back();
    // this.router.navigate([`/rooms`]);
  }

  downloadPhotos() {
    const nomeProgetto = this.roomName.trim().replace(' ', '');
    this.mediaServ.checkDownload(nomeProgetto).subscribe((value: boolean) => {
      if (value) {
        const link = document.createElement('a');
        link.setAttribute(
          'href',
          `${environment.apiUrl}/downloadzip/${nomeProgetto}`
        );
        link.setAttribute('download', `${nomeProgetto}.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        this.presentToast(
          `Non ci sono foto sul progetto ${nomeProgetto}!`,
          'danger'
        );
      }
    });
  }

  editPhoto(photo: Photo) {
    this.modalController
      .create({
        component: PhotoDetailsComponent,
        cssClass: 'modal-fullscreen',
        componentProps: { foto: photo, roomName: this.roomName },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((res) => {
        if (res.role === 'ok') {
          this.presentToast(`Foto aggiornata`, 'secondary');
        } else if (res.role === 'error') {
          this.presentToast(
            `Aggiornamento fallito, ripetere l'operazione`,
            'danger'
          );
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
