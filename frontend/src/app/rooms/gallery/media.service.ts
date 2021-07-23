import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthService } from '../../auth/auth.service';

export interface Photo {
  imageBase64: string;
  idRoom: number;
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
  numeroFoto: number;
  numeroPagine: number;
  numeroFotoXPagina: number;
}

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  fotoData: Photo;
  numberOfFotoXPage: string = '12';

  public photoSetSubject = new BehaviorSubject<Photo[]>([]);
  photoSet$: Observable<Photo[]> = this.photoSetSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  checkMedia(id: string) {
    return this.http.get(`${environment.apiUrl}/checkGalleria/${id}`).pipe(
      map((res) => {
        return res[0];
      })
    );
  }

  loadPhotos(id: string, numPage: number) {
    let addedFoto: Photo[];
    return this.photoSet$.pipe(
      take(1),
      switchMap((res) => {
        addedFoto = [...res];
        return this.http.get(
          `${environment.apiUrl}/s/galleria/0/${id}/${numPage}/${this.numberOfFotoXPage}`
        );
      }),
      catchError((err) => {
        console.log('errore: ', err);
        return of([]);
      }),
      map((res) => {
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            addedFoto.push({
              imageBase64: res[key]['foto'],
              idRoom: res[key]['idroom'],
              idPhoto: res[key]['idPhoto'],
              progettoselezionato: res[key]['progettoselezionato'],
              collaudatoreufficio: res[key]['collaudatoreufficio'],
              dataimg: res[key]['dataimg'],
              nameimg: res[key]['nameimg'],
              latitu: res[key]['latitu'],
              longitu: res[key]['longitu'],
              nomelemento: res[key]['nomelemento'],
              noteimg: res[key]['noteimg'],
              onlynota: res[key]['onlynota'],
            });
          }
        }
        return addedFoto;
      }),
      tap((res: Photo[]) => {
        this.photoSetSubject.next(res);
      })
    );
  }

  checkDownload(nomeProgetto: string) {
    return this.http.get(
      `${environment.apiUrl}/checkdownloadzip/${nomeProgetto}`
    );
  }

  downloadFoto(nomeProgetto: string) {
    return this.http.get(`${environment.apiUrl}/downloadzip/${nomeProgetto}`);
  }

  deleteFoto(idFoto: number) {
    let updatedFotos: Photo[];
    return this.photoSet$.pipe(
      take(1),
      switchMap((fotoRes) => {
        updatedFotos = fotoRes.filter((foto) => foto.idPhoto != idFoto);
        return this.http.post(`${environment.apiUrl}/d`, {
          id: idFoto,
          tableDelete: 'collaudolive',
        });
      }),
      catchError((err) => {
        return throwError(err);
      }),
      tap((res) => {
        this.photoSetSubject.next(updatedFotos);
      })
    );
  }

  updateFoto(fotoID: any, fotoNome: string, fotoNote: string) {
    return this.http.put(`${environment.apiUrl}/ug`, {
      id: fotoID,
      nomelemento: fotoNome,
      noteimg: fotoNote,
    });
  }

  addPhoto(
    imageBase64: string,
    idPhoto: number,
    imgName: string,
    imgTitle: string,
    imgNotes: string,
    imgData: Date,
    idUtente: string,
    idRoom: number,
    usermobile: string,
    nomeProgetto: string,
    lat: string,
    long: string
  ) {
    let updatedPhotos: Photo[];
    const newPhoto = {
      imageBase64: imageBase64,
      idPhoto: idPhoto, // ??????????????????
      nameimg: imgName,
      nomelemento: imgTitle,
      noteimg: imgNotes ? imgNotes : '',
      dataimg: imgData,
      collaudatoreufficio: idUtente,
      idRoom: idRoom,
      progettoselezionato: nomeProgetto,
      latitu: lat,
      longitu: long,
      onlynota: 0,
    };
    console.log('🐱‍👤 : newPhoto', newPhoto);
    console.log('🐱‍👤 : API', {
      id: +idPhoto,
      prodnumber: usermobile,
      progettoselezionato: nomeProgetto,
      collaudatoreufficio: `${idUtente}`,
      latitu: lat,
      longitu: long,
      nameimg: imgName,
      nomelemento: imgTitle,
      noteimg: imgNotes ? imgNotes : '',
      img: imageBase64,
      onlynota: 0,
    });

    return this.photoSet$.pipe(
      take(1),
      switchMap((photos) => {
        updatedPhotos = [...photos];
        return this.http.post(`${environment.apiUrl}/cph/`, {
          id: +idPhoto,
          prodnumber: usermobile,
          progettoselezionato: nomeProgetto,
          collaudatoreufficio: `${idUtente}`,
          latitu: lat,
          longitu: long,
          nameimg: imgName,
          nomelemento: imgTitle,
          noteimg: imgNotes ? imgNotes : '',
          img: imageBase64,
          onlynota: 0,
        });
      }),
      catchError((err) => {
        return throwError(err);
      }),
      tap((res) => {
        updatedPhotos.unshift(newPhoto);
        this.photoSetSubject.next(updatedPhotos);
      })
    );
  }
}
