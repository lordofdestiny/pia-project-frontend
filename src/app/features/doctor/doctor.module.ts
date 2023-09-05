import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DoctorRoutingModule } from './doctor-routing.module';
import { DoctorComponent } from './doctor.component';
import { DoctorProfileComponent } from './pages/doctor-profile/doctor-profile.component';
import { SharedModule } from '@shared/shared.module';
import { PickExaminationsComponent } from './components/pick-examinations/pick-examinations.component';

@NgModule({
    declarations: [DoctorComponent, DoctorProfileComponent, PickExaminationsComponent],
    imports: [
        CommonModule,
        //Angular material
        MatTabsModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        //My modules
        SharedModule,
        DoctorRoutingModule,
    ],
})
export class DoctorModule {}
