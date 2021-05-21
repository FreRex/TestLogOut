import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ajax } from 'rxjs/ajax';
import { environment } from 'src/environments/environment';



export interface Foto {
  id: number;
  progettoselezionato: string;
  collaudatoreufficio: Date;
  dataimg: Date;
  nameimg: string;
  latitu: string;
  longitu: string;
  nomelemento: string;
  noteimg: string;
  onlynota: number;
}

@Injectable({
  providedIn: 'root'
})
export class MediaServiceService{

  fotoData: Foto;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  loadMedia(id:string){
    return this.http
    .get(
      `${environment.apiUrl}/s/galleria/0/0/${id}/1`,
    ).subscribe(
      res =>{
        console.log(res);
      }
    ) 
  }

  checkDownload(nomeProgetto: string) {
    return this.http.get(
      `${environment.apiUrl}/checkdownloadzip/${nomeProgetto}`,
      { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) });
  }
  
  downloadFoto(nomeProgetto: string) {
    return this.http.get(
      `${environment.apiUrl}/downloadzip/${nomeProgetto}`,
      {
        // responseType: 'arraybuffer',
        // reportProgress: true,
        // observe: 'events',
        headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`)
      }
    );
  }

}
