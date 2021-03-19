import { NgModule } from '@angular/core';
import { ObsWithStatusPipe } from './shared/obs-with-status.pipe';
@NgModule({
    declarations: [
        ObsWithStatusPipe
    ],
    imports: [],
    exports: [
        ObsWithStatusPipe
    ]
})
export class PipesModule {}