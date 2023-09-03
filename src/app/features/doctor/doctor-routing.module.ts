import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorComponent } from './doctor.component';
import { DoctorProfileComponent } from './pages/doctor-profile/doctor-profile.component';
import { RoleGuard } from '@core/guards/role.guard';

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
