import { NgModule } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    RouterModule,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';

import { RoleGuard } from '@core/guards/role.guard';
import { PatientsResolver } from '@core/resolvers/patients.resolver';
import { DoctorsResolver } from '@core/resolvers/doctors.resolver';
import { SpecializationsResolver } from '@core/resolvers/specializations.resolver';

import { ManagerComponent } from './manager.component';
import { ManagerProfileComponent } from './pages/manager-profile/manager-profile.component';
import { ManageUsersComponent } from './pages/manage-users/manage-users.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [RoleGuard],
        data: {
            expectedRole: 'manager',
        },
        component: ManagerComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'profile',
            },
            {
                path: 'profile',
                component: ManagerProfileComponent,
            },
            {
                path: 'users',
                resolve: {
                    patients: PatientsResolver,
                    doctors: DoctorsResolver,
                    specializations: SpecializationsResolver,
                },
                component: ManageUsersComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ManagerRoutingModule {}
