import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GalleryPageRoutingModule } from './gallery-routing.module';

import { GalleryPage } from './gallery.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { PhotoDetailsComponent } from './photo-details/photo-details.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, GalleryPageRoutingModule, SharedModule],
  declarations: [GalleryPage, PhotoDetailsComponent], 
  entryComponents: [PhotoDetailsComponent],
})
export class GalleryPageModule {}
