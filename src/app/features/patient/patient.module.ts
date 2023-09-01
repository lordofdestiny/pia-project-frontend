import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

import { PatientRoutingModule } from './patient-routing.module';

import { SharedModule } from '@shared/shared.module';

import { PatientComponent } from './patient.component';
import { PatientProfileComponent } from './pages/patient-profile/patient-profile.component';

@NgModule({
    declarations: [PatientComponent, PatientProfileComponent],
    imports: [
        // Angular
        CommonModule,
        // Angular Material
        MatIconModule,
        MatTabsModule,
        // My Modules
        SharedModule,
        // Routing
        PatientRoutingModule,
    ],
})
export class PatientModule {}
