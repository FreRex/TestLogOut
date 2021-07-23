import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthUser } from 'src/app/auth/auth-user.model';
import { MediaService } from 'src/app/rooms/gallery/media.service';
import { Room } from 'src/app/rooms/room.service';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.scss'],
})
export class PhotoModalComponent implements OnInit, AfterViewInit {
  form: FormGroup = this.fb.group({
    title: [null, [Validators.required]],
    note: [null],
  });

  @ViewChild('canvas') public canvas: ElementRef;

  @Input() WIDTH: number;
  @Input() HEIGHT: number;
  @Input() image: HTMLImageElement;
  @Input() room: Room;
  @Input() user: AuthUser;

  public date: Date;
  public idPhoto: number;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private mediaService: MediaService
  ) {}

  ngOnInit() {
    this.date = new Date();
    this.idPhoto = this.date.getTime();
  }

  ngAfterViewInit() {
    if (this.image) {
      console.log('🐱‍👤 : WIDTH', this.WIDTH);
      console.log('🐱‍👤 : HEIGHT', this.HEIGHT);
      console.log('🐱‍👤 : this.image', this.image);

      this.canvas.nativeElement
        .getContext('2d')
        .drawImage(this.image, 0, 0, this.WIDTH, this.HEIGHT);
    }
  }

  createPhoto() {
    if (!this.form.valid) {
      return;
    }
    let imgBase64 = this.canvas.nativeElement
      .toDataURL('image/png')
      .replace(/^data:image\/(png|jpg);base64,/, '');
    // .split(';base64,')[1];
    console.log(imgBase64);

    this.mediaService
      .addPhoto(
        // imgBase64,
        'gggggggggggggg',
        this.idPhoto,
        `img${this.idPhoto}`,
        this.form.value.title,
        this.form.value.note,
        this.date,
        this.user.idutente,
        this.room.id,
        this.room.usermobile,
        this.room.progetto,
        '11.11111',
        '22.22222'
      )
      .subscribe(
        /** Il server risponde con 200 */
        (res) => {
          console.log('🐱‍👤 : res', res);
          // non ci sono errori
          if (res['affectedRows'] === 1) {
            this.form.reset();
            this.modalController.dismiss({ message: 'Foto Salvata' }, 'ok');
          }
          // possibili errori
          else {
            this.form.reset();
            this.modalController.dismiss({ message: res['message'] }, 'error');
          }
        },
        /** Il server risponde con un errore */
        (err) => {
          console.log('🐱‍👤 : err', err);
          this.form.reset();
          this.modalController.dismiss({ message: err.error['text'] }, 'error');
        }
      );
  }

  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }
}
