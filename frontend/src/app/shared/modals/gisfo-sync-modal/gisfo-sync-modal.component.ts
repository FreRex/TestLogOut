import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { User, UserService } from '../../user.service';

@Component({
  selector: 'app-gisfo-sync-modal',
  templateUrl: './gisfo-sync-modal.component.html',
  styleUrls: ['./gisfo-sync-modal.component.scss'],
})
export class GisfoSyncModalComponent implements OnInit {

  form: FormGroup;
  users$: Observable<User[]>;
  selectedUser: User;
  isListOpen: boolean = false;

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.users$ = this.userService.users$;
    this.form = new FormGroup({
      collaudatoreufficio: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      pk_proj: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
    });
  }
  onChooseUser(user: User) {
    this.isListOpen = false;
    this.selectedUser = user;
    this.form.patchValue({
      collaudatoreufficio: this.selectedUser.collaudatoreufficio,
    });
  }
  closeModal() {
    this.modalCtrl.dismiss(GisfoSyncModalComponent);
  }
}
