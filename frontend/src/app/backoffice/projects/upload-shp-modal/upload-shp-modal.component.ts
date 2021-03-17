import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User, UserService } from '../../users/user.service';

@Component({
  selector: 'app-upload-shp-modal',
  templateUrl: './upload-shp-modal.component.html',
  styleUrls: ['./upload-shp-modal.component.scss'],
})
export class UploadShpModalComponent implements OnInit {

  private sub : Subscription;
  users:User[];

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.sub = this.userService.users$.subscribe(
      (users:User[]) => {
        this.users = users;
      }
    )
  }

  closeModal(){
    this.modalCtrl.dismiss(UploadShpModalComponent);
  }
}
