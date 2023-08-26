import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule as SharedPipesModule } from './pipes/pipes.shared.module';

import { SharedComponenetsModule } from '@shared/components/components.shared.module';
import { DirectivesModules } from '@shared/directives/directives.shared.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        SharedComponenetsModule,
        SharedPipesModule,
        DirectivesModules,
    ],
    exports: [SharedComponenetsModule, SharedPipesModule, DirectivesModules],
})
export class SharedModule {}
