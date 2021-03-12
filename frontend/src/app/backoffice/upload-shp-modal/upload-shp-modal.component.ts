import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-upload-shp-modal',
  templateUrl: './upload-shp-modal.component.html',
  styleUrls: ['./upload-shp-modal.component.scss'],
})
export class UploadShpModalComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  closeModal(){
    this.modalCtrl.dismiss(UploadShpModalComponent);
  }
}
