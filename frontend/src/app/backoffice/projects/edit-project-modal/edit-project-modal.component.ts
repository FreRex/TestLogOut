import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User, UserService } from '../../users/user.service';

@Component({
  selector: 'app-edit-project-modal',
  templateUrl: './edit-project-modal.component.html',
  styleUrls: ['./edit-project-modal.component.scss'],
})
export class EditProjectModalComponent implements OnInit {

  form:FormGroup;
  private sub : Subscription;
  users:User[];

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {

    this.form = new FormGroup({
      collaudatoreufficio: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      pk_proj: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      nome: new FormControl( null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      long_centro_map: new FormControl( null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      lat_centro_map: new FormControl( null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      nodi_fisici: new FormControl( null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      nodi_ottici: new FormControl( null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      tratte: new FormControl( null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
        conn_edif_opta: new FormControl( null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),


    });



    this.sub = this.userService.users$.subscribe(
      (users:User[]) => {
        this.users = users;
      }
    )
  }

  closeModal(){
    this.modalCtrl.dismiss(EditProjectModalComponent);
  }
}
