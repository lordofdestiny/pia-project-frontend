import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DoctorListModule } from './doctor-list/doctor-list.module';

@NgModule({
    declarations: [],
    providers: [],
    imports: [CommonModule, RouterModule],
    exports: [DoctorListModule],
})
export class SharedComponenetsModule {}
