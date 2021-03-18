import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { StorageDataService } from './shared/storage-data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  isLoading = false; 
  constructor(
    private store: StorageDataService,
    private authService: AuthService
    ) {}

  ngOnInit(){
    this.authService.authorizeAccess().subscribe(
      res => {
        console.log(res);
        this.store.init();
      }
    );
  }


}
