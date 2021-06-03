import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TestStreamPageRoutingModule } from './test-stream-routing.module';
import { TestStreamPage } from './test-stream.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TestStreamPageRoutingModule],
  declarations: [TestStreamPage],
})
export class TestStreamPageModule {}
