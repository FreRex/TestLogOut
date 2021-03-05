import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NPerfLinkPage } from './nperf-link.page';

const routes: Routes = [
  {
    path: '',
    component: NPerfLinkPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NPerfLinkPageRoutingModule {}
