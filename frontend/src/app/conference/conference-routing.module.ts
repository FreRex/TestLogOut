import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConferencePage } from './conference.page';

const routes: Routes = [
  // {
  //   path: ':room',
  //   component: ConferencePage,
  // },
  // {
  //   path: '',
  //   redirectTo: '/not-found',
  // },
  {
    path: '',
    component: ConferencePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConferencePageRoutingModule {}
