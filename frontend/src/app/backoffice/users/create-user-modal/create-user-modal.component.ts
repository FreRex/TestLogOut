import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.scss'],
})
export class CreateUserModalComponent implements OnInit {

  form:FormGroup;


  constructor(
    private modalCtrl: ModalController,
    private userService: UserService
  ) { }

  ngOnInit() {

    this.form = new FormGroup({
      collaudatoreufficio: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      username: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      password: new FormControl( null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      autorizzazioni: new FormControl( null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(1)]
      }),

    });


  }

  closeModal(){
    this.modalCtrl.dismiss(CreateUserModalComponent);
  }

  createUser(){
    if (!this.form.valid) { return; }
    this.userService
      .addUser(
        this.form.value.collaudatoreufficio,
        this.form.value.username,
        this.form.value.password,
        +this.form.value.autorizzazioni)
      .subscribe(
        res => {
          // console.log("Response",res);
          // this.presentToast('Room creata!');
          this.form.reset();
          this.modalCtrl.dismiss({ message: 'user create' }, 'save');
        },
        // (err: HttpErrorResponse) => {
        //   console.log("Error:", err.error['text']);
        //   this.createErrorAlert(err.error['text']);
        // }
      );

  }
}
