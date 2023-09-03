import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DoctorRoutingModule } from './doctor-routing.module';
import { DoctorComponent } from './doctor.component';
import { DoctorProfileComponent } from './pages/doctor-profile/doctor-profile.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    declarations: [DoctorComponent, DoctorProfileComponent],
    imports: [
        CommonModule,
        //Angular material
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        //My modules
        SharedModule,
        DoctorRoutingModule,
    ],
})
export class DoctorModule {}
