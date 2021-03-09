import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Proj } from './proj.model';

export interface User{
  nome_collaudatore: string,
  username: string,
  password: string,
  autorizzazioni: number,
  id?: number,
  checkGis?: number
}

@Injectable({
  providedIn: 'root'
})
export class ProjService {

  private _shpProj: Proj[]=[];


  constructor(
    private http: HttpClient
  ) {}

  getProjects() {
    return this._shpProj.slice();
  }
  fetchProjects():Observable<any> {
    return this.http
      .get<Proj>(
        'https://www.collaudolive.com:9083/s/progetti/'
      )
      .pipe(
        map(
          resData => {
            for (const key in resData) {
/*               console.log(key);
              console.log(resData[key]); */
              if (resData.hasOwnProperty(key)) {
                this._shpProj.push(
                  new Proj(
                    resData[key].id,
                    resData[key].idutente,
                    resData[key].pk_proj,
                    resData[key].nome,
                    resData[key].lat_centro_map,
                    resData[key].long_centro_map,
                    )
                  );
              }
            }
          }
        )
      );
  }

  fetchUsers():Observable<User[]>{
    return this.http.get<User[]>("https://www.collaudolive.com:9083/s/utenti/");
  }

  addUser(user:User):Observable<any>{
    return this.http.post<User> ("apidelcazzo",user)
  }
}
