import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestAudiortcPage } from './test-audiortc.page';

const routes: Routes = [
  {
    path: '',
    component: TestAudiortcPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestAudiortcPageRoutingModule {}
