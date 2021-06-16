import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@capacitor/storage';
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
export class AuthPage implements OnInit {
  roomInfo: RoomInfo;
  public directLink: boolean = false;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // this.activatedRoute.queryParams
    from(Storage.get({ key: 'roomData' })).subscribe((storedData) => {
      if (!storedData || !storedData.value) {
        // !params['roomId'] ||
        // !params['session'] ||
        // !params['project'] ||
        // !params['creator']
        this.directLink = false;
        return null;
      }
      this.directLink = true;
      const parsedData = JSON.parse(storedData.value);
      console.log('parsedData', parsedData);
      // this.roomInfo = {
      //   roomId: decodeURIComponent(params['roomId']),
      //   session: decodeURIComponent(params['session']),
      //   project: decodeURIComponent(params['project']),
      //   creator: decodeURIComponent(params['creator']),
      // };
      this.roomInfo = {
        roomId: parsedData.roomId,
        session: parsedData.session,
        project: parsedData.project,
        creator: parsedData.creator,
      };
    });
  }
}
