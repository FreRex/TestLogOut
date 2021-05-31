import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthService } from '../../auth/auth.service';

export interface Foto {
  imageBase64: string;
  id: number;
  idPhoto: number;
  progettoselezionato: string;
  collaudatoreufficio: string;
  dataimg: Date;
  nameimg: string;
  latitu: string;
  longitu: string;
  nomelemento: string;
  noteimg: string;
  onlynota: number;
}
export interface Check {
  numeroFoto: number,
  numeroPagine: number,
  numeroFotoXPagina: number
}

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  fotoData: Foto;
  numberOfFotoXPage: string = "10";

  private fotoSetSubject = new BehaviorSubject<Foto[]>([]);
  fotoSet$: Observable<Foto[]> = this.fotoSetSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  checkMedia(id:string){
    return this.http.get(`${environment.apiUrl}/checkGalleria/${id}`)
    .pipe(
      map(res=> {
      return res[0];
      })
    )
  }

  loadMedia(id: string, numPage:number, event?) {
    return this.http.get(`${environment.apiUrl}/s/galleria/0/${id}/${numPage}/${this.numberOfFotoXPage}`)
    .pipe(
      take(1),
      catchError(err =>{
        console.log('errore: ', err)
        return of ([])
        }
      ),
      map(res=>{
        const foto: Foto[] = [];
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            
            foto.push({
              imageBase64:res[key]['foto'],
              id: res[key]['id'],
              idPhoto: res[key]['idPhoto'],
              progettoselezionato: res[key]['progettoselezionato'],
              collaudatoreufficio: res[key]['collaudatoreufficio'],
              dataimg: res[key]['dataimg'],
              nameimg: res[key]['nameimg'],
              latitu: res[key]['latitu'],
              longitu: res[key]['longitu'],
              nomelemento: res[key]['nomelemento'],
              noteimg: res[key]['noteimg'],
              onlynota: res[key]['onlynota']
            });
          }
      }
      return foto;
    }),
      tap((res:Foto[])=>{
        this.fotoSetSubject.next(res)
      })
      )
  }

  checkDownload(nomeProgetto: string) {
    return this.http.get(`${environment.apiUrl}/checkdownloadzip/${nomeProgetto}`);
  }

  downloadFoto(nomeProgetto: string) {
    return this.http.get(`${environment.apiUrl}/downloadzip/${nomeProgetto}`);
  }

  deleteFoto(idFoto){
    return this.http.post(`${environment.apiUrl}/d`, {id: idFoto, tableDelete: 'collaudolive' }).pipe(
      catchError((err) => {
        return throwError(err);
      }),


    )


 
    
  }
}
