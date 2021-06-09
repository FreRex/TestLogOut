import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { NavController } from '@ionic/angular';
import { from, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { StreamingService } from './streaming.service';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.page.html',
  styleUrls: ['./conference.page.scss'],
})
export class ConferencePage implements OnInit, AfterViewInit {
  private sub: Subscription;

  roomId: string = '';
  userId: string = '';

  constructor(
    private activatedRouter: ActivatedRoute,
    private navController: NavController,
    private streamingService: StreamingService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.activatedRouter.paramMap
      .pipe(
        switchMap((paramMap) => {
          if (!paramMap.has('roomId')) {
            this.navController.navigateBack(['/rooms']);
            return;
          }
          this.roomId = paramMap.get('roomId');
          return from(Storage.get({ key: 'authData' }));
        }),
        map((storedData) => {
          if (!storedData || !storedData.value) {
            return null;
          }
          return JSON.parse(storedData.value).idutcas;
        })
      )
      .subscribe((userId) => {
        this.userId = userId;
        this.streamingService.configureSocket(this.roomId, this.userId);
        console.log('🐱‍👤 : ConferencePage : this.userId', this.userId);
        console.log('🐱‍👤 : ConferencePage : this.roomId', this.roomId);
      });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe;
    }
  }
}
