import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
    this.activatedRoute.queryParams.subscribe((params) => {
      if (
        !params ||
        !params['roomId'] ||
        !params['session'] ||
        !params['project'] ||
        !params['creator']
      ) {
        this.directLink = false;
        return;
      }
      this.directLink = true;
      console.log(params);
      this.roomInfo = {
        roomId: decodeURIComponent(params['roomId']),
        session: decodeURIComponent(params['session']),
        project: decodeURIComponent(params['project']),
        creator: decodeURIComponent(params['creator']),
      };
    });
  }
}
