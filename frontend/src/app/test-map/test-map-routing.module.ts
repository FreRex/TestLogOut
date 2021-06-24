import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestMapPage } from './test-map.page';

const routes: Routes = [
  {
    path: '',
    component: TestMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestMapPageRoutingModule {}
