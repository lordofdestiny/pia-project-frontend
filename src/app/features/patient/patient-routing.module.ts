import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientComponent } from './patient.component';
import { PatientProfileComponent } from './pages/patient-profile/patient-profile.component';
import { SpecializationsResolver } from '@core/resolver/specializations.resolver';
import { DoctorsComponent } from './pages/doctors/doctors.component';

const routes: Routes = [
    {
        path: '',
        component: PatientComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'profile',
            },
            {
                path: 'profile',
                resolve: {
                    specializations: SpecializationsResolver,
                },
                component: PatientProfileComponent,
            },
            {
                path: 'doctors',
                component: DoctorsComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PatientRoutingModule {}
