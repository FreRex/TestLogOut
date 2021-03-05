import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProjService, User } from '../proj.service';

@Component({
  selector: 'app-gisfo-sync-modal',
  templateUrl: './gisfo-sync-modal.component.html',
  styleUrls: ['./gisfo-sync-modal.component.scss'],
})
export class GisfoSyncModalComponent implements OnInit {

  users:User[];

  constructor(
    private projService: ProjService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  showUsersList(){
    this.projService.fetchUsers().subscribe(
      users => this.users = users
    );
  }

  closeModal(){
    this.modalCtrl.dismiss(GisfoSyncModalComponent);
  }
}
