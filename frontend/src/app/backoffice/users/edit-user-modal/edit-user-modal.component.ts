import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss'],
})
export class EditUserModalComponent implements OnInit {

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
    this.modalCtrl.dismiss(EditUserModalComponent);
  }
}
