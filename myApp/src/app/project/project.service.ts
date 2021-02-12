import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from './project.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projects: Project[] = [];

  constructor(private http: HttpClient) { }

  getProjects(){
    return this.projects.slice();
  }

  fetchProjects(){
    return this.http
      .get<Project>(
        'http://www.collaudolive.com:9082/'
      )
      .pipe(
        map(
          resData => {
            for (const key in resData) {
              console.log(key);
              console.log(resData[key]);
              
              if (resData.hasOwnProperty(key)) {
                this.projects.push({ ...resData[key], id: key });
              }
            }
          }
        )
      );
  }

}
