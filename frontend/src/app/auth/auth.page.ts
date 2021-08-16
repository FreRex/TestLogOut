import { Component, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { ViewWillEnter } from '@ionic/angular';
import { from } from 'rxjs';

interface RoomInfo {
  roomId: string;
  session: string;
  project: string;
  creator: string;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, ViewWillEnter {
  public directLink: boolean = false;
  public roomInfo: RoomInfo;
  // public roomId: string;

  constructor() {}

  ionViewWillEnter() {
    // Storage.remove({ key: 'authData' });
  }

  ngOnInit() {
    from(Storage.get({ key: 'roomData' })).subscribe((storedData) => {
      if (!storedData || !storedData.value) {
        this.directLink = false;
        return null;
      }
      this.directLink = true;
      const parsedData = JSON.parse(storedData.value);
      // this.roomId = parsedData.roomId;
      // console.log('parsedData', parsedData);
      this.roomInfo = {
        roomId: parsedData.roomId,
        session: parsedData.session,
        project: parsedData.project,
        creator: parsedData.creator,
      };
    });
  }
}
