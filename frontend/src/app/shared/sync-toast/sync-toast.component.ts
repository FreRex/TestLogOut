import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SyncInfo, SyncService } from './sync.service';

@Component({
  selector: 'app-sync-toast',
  templateUrl: './sync-toast.component.html',
  styleUrls: ['./sync-toast.component.scss'],
})
export class SyncToastComponent implements OnInit, OnDestroy {

  @ViewChild('bar', { static: true }) bar: ElementRef;

  sync: SyncInfo;
  subscription: Subscription;
  requested: boolean = false;
  completed: boolean = false;

  constructor(public syncService: SyncService) { }

  ngOnInit() {
    this.subscription = this.syncService.syncInfo$.subscribe(
      (sync: SyncInfo) => {
        this.sync = sync;
        this.requested = true;
        this.completed = false;
        /* Restart Progressbar Animation */
        // let element = document.getElementById("time-bar");
        this.bar.nativeElement.classList.remove("time-bar");
        this.bar.nativeElement.offsetWidth;
        this.bar.nativeElement.classList.add("time-bar");
      });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
