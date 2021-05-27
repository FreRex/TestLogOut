import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Foto } from '../media.service';

@Component({
  selector: 'app-photo-details',
  templateUrl: './photo-details.component.html',
  styleUrls: ['./photo-details.component.scss'],
})
export class PhotoDetailsComponent implements OnInit{


  @Input() foto: Foto;

  constructor(
    public modalController: ModalController,
    
  ) { }

  ngOnInit() {
    console.log("modale aperto:",this.foto);
    
    
  }

  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }
}
