import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebugPipe } from './debug.pipe';

@NgModule({
    declarations: [DebugPipe],
    imports: [CommonModule],
    exports: [DebugPipe],
})
export class PipesModule {}
