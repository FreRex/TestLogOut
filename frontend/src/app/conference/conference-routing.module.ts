import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConferencePage } from './conference.page';

const routes: Routes = [
  // * se uso i parametri della url
  {
    path: ':roomId',
    component: ConferencePage,
  },
  {
    path: '',
    redirectTo: '/not-found',
  },
  // * se uso i queryParams
  // {
  //   path: '',
  //   component: ConferencePage,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConferencePageRoutingModule {}
