import { Component, OnInit } from '@angular/core';
import { StorageDataService } from './shared/storage-data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(private store:StorageDataService) {}

  ngOnInit(){
    this.store.init();
  }


}
