import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
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
export class PhotoModalComponent implements AfterViewInit {
  form: FormGroup = this.fb.group({
    nome: [
      null,
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    title: [
      null,
      {
        validators: [Validators.required],
        updateOn: 'submit',
      },
    ],
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

  ngAfterViewInit() {
    if (this.image) {
      console.log('🐱‍👤 : WIDTH', this.WIDTH);
      console.log('🐱‍👤 : HEIGHT', this.HEIGHT);
      console.log('🐱‍👤 : this.image', this.image);

      this.date = new Date();
      this.idPhoto = this.date.getTime();

      this.canvas.nativeElement
        .getContext('2d')
        .drawImage(this.image, 0, 0, this.WIDTH, this.HEIGHT);
    }
  }

  createPhoto() {
    if (!this.form.valid) {
      return;
    }
    this.mediaService
      .addPhoto(
        this.canvas.nativeElement.toDataURL('image/png'),
        this.idPhoto,
        `img${this.idPhoto}`,
        this.form.value.nome,
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
          this.form.reset();
          this.modalController.dismiss({ message: err.error['text'] }, 'error');
        }
      );
  }

  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }
}
