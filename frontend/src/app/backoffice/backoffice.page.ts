import { Component, OnInit } from '@angular/core';
import { Proj } from './proj.model';

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.page.html',
  styleUrls: ['./backoffice.page.scss'],
})
export class BackofficePage implements OnInit {

  /* array test per lista progetti */
  projects: Proj[] = [
    {
      pkProj: 'pk025626541',
      name: 'Comune a Caso 1'
    },
    {
      pkProj: 'pk025626542',
      name: 'Comune a Caso 2'
    },
    {
      pkProj: 'pk025626543',
      name: 'Comune a Caso 3'
    },
    {
      pkProj: 'pk025626544',
      name: 'Comune a Caso 4'
    },
    {
      pkProj: 'pk025626545',
      name: 'Comune a Caso 5'
    },
    {
      pkProj: 'pk025626546',
      name: 'Comune a Caso 6'
    },
    {
      pkProj: 'pk025626547',
      name: 'Comune a Caso 7'
    },
    {
      pkProj: 'pk025626548',
      name: 'Comune a Caso 8'
    },
    {
      pkProj: 'pk025626549',
      name: 'Comune a Caso 9'
    },
    {
      pkProj: 'pk025626540',
      name: 'Comune a Caso 10'
    },
  ]

  constructor() { }

  ngOnInit() {
  }

}
