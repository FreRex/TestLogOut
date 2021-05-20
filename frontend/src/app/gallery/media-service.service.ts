import { Injectable, OnInit } from '@angular/core';

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

@Injectable({
  providedIn: 'root',
})
export class MediaServiceService implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log('quiqui');
  }
}
