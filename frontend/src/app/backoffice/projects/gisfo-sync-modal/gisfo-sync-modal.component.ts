import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User, UserService } from '../../users/user.service';

@Component({
  selector: 'app-gisfo-sync-modal',
  templateUrl: './gisfo-sync-modal.component.html',
  styleUrls: ['./gisfo-sync-modal.component.scss'],
})
export class GisfoSyncModalComponent implements OnInit, OnDestroy {

  private sub : Subscription;
  users:User[];
  form:FormGroup;

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
          validators: [Validators.required, Validators.maxLength(30)]
        }),

      });


    this.sub = this.userService.users$.subscribe(
      (users:User[]) => {
        this.users = users;
      }
    )
  }

  ngOnDestroy(){
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  closeModal(){
    this.modalCtrl.dismiss(GisfoSyncModalComponent);
  }
}
