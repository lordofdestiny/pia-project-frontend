import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientComponent } from './patient.component';
import { PatientProfileComponent } from './pages/patient-profile/patient-profile.component';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import { ExaminationsComponent } from './pages/examinations/examinations.component';

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
                component: PatientProfileComponent,
            },
            {
                path: 'doctors',
                component: DoctorsComponent,
            },
            {
                path: 'examinations',
                component: ExaminationsComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PatientRoutingModule {}
