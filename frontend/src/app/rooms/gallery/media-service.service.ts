import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { AuthService } from '../../auth/auth.service';

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
  providedIn: 'root',
})
export class MediaServiceService {
  fotoData: Foto;

  constructor(private http: HttpClient, private authService: AuthService) {}

  loadMedia(id: string) {
    return this.http.get(`${environment.apiUrl}/s/galleria/0/0/${id}/1`).subscribe((res) => {
      console.log(res);
    });
  }

  checkDownload(nomeProgetto: string) {
    return this.http.get(`${environment.apiUrl}/checkdownloadzip/${nomeProgetto}`);
  }

  downloadFoto(nomeProgetto: string) {
    return this.http.get(`${environment.apiUrl}/downloadzip/${nomeProgetto}`);
  }
}
