import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HoldDirective } from './hold.directive';
import { NgVar } from './ng-var.directive';

@NgModule({
    declarations: [HoldDirective, NgVar],
    imports: [CommonModule],
    exports: [HoldDirective, NgVar],
})
export class SharedDirectivesModule {}
