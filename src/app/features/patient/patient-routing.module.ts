import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientComponent } from './patient.component';
import { PatientProfileComponent } from './pages/patient-profile/patient-profile.component';
import { SpecializationsResolver } from '@core/resolver/specializations.resolver';

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
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PatientRoutingModule {}
