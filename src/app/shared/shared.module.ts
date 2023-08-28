import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule as SharedPipesModule } from './pipes/pipes.shared.module';

import { SharedComponenetsModule } from '@shared/components/components.shared.module';
import { SharedDirectivesModule } from '@shared/directives/directives.shared.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        SharedComponenetsModule,
        SharedPipesModule,
        SharedDirectivesModule,
    ],
    exports: [
        SharedComponenetsModule,
        SharedPipesModule,
        SharedDirectivesModule,
    ],
})
export class SharedModule {}
