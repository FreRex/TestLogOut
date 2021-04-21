import { Component, OnInit } from '@angular/core';
import { StorageDataService } from '../shared/storage-data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  constructor(private dataService: StorageDataService) { }

  ngOnInit() {
    this.dataService.loadData();
  }

}
