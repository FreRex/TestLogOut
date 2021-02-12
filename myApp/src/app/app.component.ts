import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent { 

  usermobile: string;
  progetto: string;
  usermobile1: string;  
  progetto1: string;
  usermobile2: string;  
  progetto2: string;

  constructor(private http: HttpClient) {  

    //http.get('http://www.collaudolive.com:9087/test.php')
    http.get('http://www.collaudolive.com:9082/')
    //http.get('/9082')
    //http.get('http:/localhost:9082/')
    .subscribe(res=> {      
      this.usermobile = res[0]['usermobile'];
      this.progetto = res[0]['progetto'];
      this.usermobile1 = res[1]['usermobile'];
      this.progetto1 = res[1]['progetto'];
      this.usermobile2 = res[2]['usermobile'];
      this.progetto2 = res[2]['progetto'];
    }); 
    
  }

}
