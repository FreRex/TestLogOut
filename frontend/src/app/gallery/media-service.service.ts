import { Injectable, OnInit } from '@angular/core';
import { Project, ProjectService } from '../admin/projects-tab/project.service';
import { ajax } from 'rxjs/ajax';


@Injectable({
  providedIn: 'root'
})

export interface foto {
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

export class MediaServiceService implements OnInit{

  constructor(

  ) { }

  ngOnInit() {
    console.log("quiqui");

  }

}
