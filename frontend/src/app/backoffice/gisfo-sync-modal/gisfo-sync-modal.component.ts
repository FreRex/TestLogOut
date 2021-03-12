import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from '../../shared/storage-data.service';

@Component({
  selector: 'app-gisfo-sync-modal',
  templateUrl: './gisfo-sync-modal.component.html',
  styleUrls: ['./gisfo-sync-modal.component.scss'],
})
export class GisfoSyncModalComponent implements OnInit {

  users:User[];

  constructor(

    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  showUsersList(){

      users => this.users = users

  }

  closeModal(){
    this.modalCtrl.dismiss(GisfoSyncModalComponent);
  }
}
