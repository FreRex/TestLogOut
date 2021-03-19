import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonInput, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { User, UserService } from 'src/app/backoffice/users/user.service';
import { RoomService } from '../../room.service';

@Component({
  selector: 'new-room-form',
  templateUrl: './new-room-form.component.html',
  styleUrls: ['./new-room-form.component.scss'],
})
export class NewRoomFormComponent implements OnInit {

  @ViewChild('searchInput', { static: true }) inputCollaudatore: IonInput;
  users$: Observable<User[]>;
  form: FormGroup;
  showList = true;

  constructor(
    private modalController: ModalController,
    private roomsService: RoomService,
    private alertController: AlertController,
    private toastController: ToastController,
    private userService: UserService
  ) { }


  ngOnInit() {
    this.onFilterUsers();

    this.form = new FormGroup({
      usermobile: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(12)]
      }),
      nome_progetto: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      nome_collaudatore: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
    });

  }

  onFilterUsers() {
    this.users$ = this.inputCollaudatore.ionInput.pipe(
      map((event) => (<HTMLInputElement>event.target).value),
      debounceTime(400),
      distinctUntilChanged(),
      startWith(""),
      switchMap((searchTerm) =>
        this.userService.users$.pipe(
          map((users) =>
            users.filter((user) =>
              user.collaudatoreufficio.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
        )
      )
    );
  }

  onChooseCollaudatore(collaudatoreufficio: string) {
    this.form.patchValue({ nome_collaudatore: collaudatoreufficio });
  }

  // onFilter(eventValue: Event) {
  //   let searchTerm = (<HTMLInputElement>eventValue.target).value;
  //   this.users = this.users.filter((user) => {
  //     return user.collaudatoreufficio.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
  //   });
  // }

  onCreateRoom() {
    if (!this.form.valid) { return; }
    this.roomsService
      .addRoom(
        this.form.value.usermobile,
        this.form.value.nome_progetto,
        this.form.value.nome_collaudatore)
      .subscribe(
        res => {
          console.log("Response", res);
          this.presentToast('Room creata!');
          this.form.reset();
          this.modalController.dismiss({ message: 'room saved' }, 'save');
        },
        (err: HttpErrorResponse) => {
          console.log("Error:", err.error['text']);
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      color: 'secondary',
      duration: 2000,
      buttons: [{ icon: 'close', role: 'cancel' }]
    })
    // FIX: si può fare in entrambi i modi, qual'è il più giusto?
    // .then(toastEl => toastEl.present());
    toast.present();
  }
}
