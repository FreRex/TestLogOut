import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit {

  datiProgetto: { usermobile: string, progetto: string }[] = [];
  // usermobile: string;
  // progetto: string;
  // usermobile1: string;  
  // progetto1: string;
  // usermobile2: string;  
  // progetto2: string;


  constructor(private http: HttpClient) { }

  ngOnInit() {
    //http.get('http://www.collaudolive.com:9087/test.php')
    
    this.http
      .get<{ usermobile: string, progetto: string }>(
        'http://www.collaudolive.com:9082/'
      )
      .pipe(
        map(
          resData => {
            for (const key in resData) {
              console.log(key);
              console.log(resData[key]);
              
              if (resData.hasOwnProperty(key)) {
                this.datiProgetto.push({ ...resData[key], id: key });
              }
            }
          }
        )
      )
      .subscribe(
        res => {
          console.log(this.datiProgetto);
          // this.usermobile = res[0]['usermobile'];
          // this.datiProgetto = res[0]['progetto'];
          // this.usermobile1 = res[1]['usermobile'];
          // this.progetto1 = res[1]['progetto'];
          // this.usermobile2 = res[2]['usermobile'];
          // this.progetto2 = res[2]['progetto'];
        }
      );

  }
}
