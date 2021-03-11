import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Proj } from '../backoffice/proj.model';


@Injectable({
  providedIn: 'root'
})
export class StorageDataService{

  private projSubj = new BehaviorSubject<Proj[]>([]);

  projects$:Observable<Proj[]> = this.projSubj.asObservable();


  constructor(
    private http:HttpClient
    ) {

    }

  init(){
      this.http
      .get<Proj[]>(
        'https://www.collaudolive.com:9083/s/progetti/'
      ).subscribe(
        projects =>{
          this.projSubj.next(projects);
        }
      )
  }

}
