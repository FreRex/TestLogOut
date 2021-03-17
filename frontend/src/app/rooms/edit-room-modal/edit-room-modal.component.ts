import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-room-modal',
  templateUrl: './edit-room-modal.component.html',
  styleUrls: ['./edit-room-modal.component.scss'],
})
export class EditRoomModalComponent implements OnInit {

  @Input() roomId: number;
  
  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {}

  onCancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  onFormEvent(event: any) {
    // FIX : tipizzare l'evento?
    console.log('shit');
    
    switch (<string>event.target) {
      case 'save':
        this.modalController.dismiss({ message: 'room saved' }, 'save');
        break;
        case 'delete':
          this.modalController.dismiss({ message: 'room deleted' }, 'delete');
          break;
        default :
          this.modalController.dismiss(null, 'cancel');
          break;
      }
  }
  
}
