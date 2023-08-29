import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorListModule } from '@shared/components/doctor-list/doctor-list.module';
import { DebugPipe } from '@shared/pipes/debug.pipe';
import { HoldDirective } from '@shared/directives/hold.directive';
import { NgVarDirective } from '@shared/directives/ng-var.directive';

@NgModule({
    declarations: [DebugPipe, HoldDirective, NgVarDirective],
    providers: [],
    imports: [CommonModule],
    exports: [DoctorListModule, DebugPipe, HoldDirective, NgVarDirective],
})
export class SharedModule {}
