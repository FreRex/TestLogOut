import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TestStreamPage } from './test-stream.page';

const routes: Routes = [
  {
    path: '',
    component: TestStreamPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestStreamPageRoutingModule {}
