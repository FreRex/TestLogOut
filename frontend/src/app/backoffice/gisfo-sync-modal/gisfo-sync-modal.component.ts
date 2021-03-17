import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { StorageDataService, User } from '../../shared/storage-data.service';

@Component({
  selector: 'app-gisfo-sync-modal',
  templateUrl: './gisfo-sync-modal.component.html',
  styleUrls: ['./gisfo-sync-modal.component.scss'],
})
export class GisfoSyncModalComponent implements OnInit, OnDestroy {

  private sub : Subscription;
  users:User[];

  constructor(
    private userService: StorageDataService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
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
