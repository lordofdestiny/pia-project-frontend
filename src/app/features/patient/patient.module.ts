import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

import { SharedModule } from '@shared/shared.module';

import { PatientComponent } from './patient.component';
import { PatientRoutingModule } from './patient-routing.module';
import { PatientProfileComponent } from './pages/patient-profile/patient-profile.component';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import { ExaminationsComponent } from './pages/examinations/examinations.component';

@NgModule({
    declarations: [
        PatientComponent,
        PatientProfileComponent,
        DoctorsComponent,
        ExaminationsComponent,
    ],
    imports: [
        // Angular
        CommonModule,
        // Angular Material
        MatIconModule,
        MatTabsModule,
        // My Modules
        SharedModule,
        PatientRoutingModule,
    ],
})
export class PatientModule {}
