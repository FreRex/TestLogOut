import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.page.html',
  styleUrls: ['./edit-room.page.scss'],
})
export class EditRoomPage implements OnInit {

  roomId: number;

  constructor(
    private activatedRouter: ActivatedRoute,
    private navController: NavController,
  ) { }

  ngOnInit() {
    this.activatedRouter.paramMap.subscribe(paramMap => {
      if (!paramMap.has('roomId')) {
        this.navController.navigateBack(['/rooms']);
        return;
      }
      this.roomId = +paramMap.get('roomId');
      console.log(this.roomId);
    });
  }

  onCancel() {
    this.navController.navigateBack(['/rooms']);
  }

  onFormEvent(event: any) {
    this.navController.navigateBack(['/rooms']);
  }

}
