import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorComponent } from './doctor.component';
import { DoctorProfileComponent } from './pages/doctor-profile/doctor-profile.component';
import { RoleGuard } from '@core/guards/role.guard';
import { SpecializationsResolver } from '@core/resolvers/specializations.resolver';
import { ExaminationsResolver } from '@core/resolvers/examinations.resolver';

const routes: Routes = [
    {
        path: '',
        canActivate: [RoleGuard],
        data: {
            expectedRole: 'doctor',
        },
        component: DoctorComponent,
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
                    examinations: ExaminationsResolver,
                },
                runGuardsAndResolvers: 'always',
                component: DoctorProfileComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DoctorRoutingModule {}
