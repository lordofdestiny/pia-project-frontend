import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule as SharedPipesModule } from './pipes/pipes.module';
import { SharedComponenetsModule } from '@components/components.shared.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, SharedComponenetsModule, SharedPipesModule],
    exports: [SharedComponenetsModule, SharedPipesModule],
})
export class SharedModule {}
