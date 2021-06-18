import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GalleryPageRoutingModule } from './gallery-routing.module';
import { GalleryPage } from './gallery.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { PhotoDetailsComponent } from './photo-details/photo-details.component';
import { GMapsComponent } from './g-maps/g-maps.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    GalleryPageRoutingModule,
    SharedModule,

    AgmCoreModule.forRoot({ apiKey: 'AIzaSyAfSMp-syOQXDlulMxr14XIV4-hgOt2DRc%27' }),
  ],
  declarations: [GalleryPage, PhotoDetailsComponent, GMapsComponent],
  entryComponents: [PhotoDetailsComponent],
})
export class GalleryPageModule {}
