import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LandingComponent } from '@features/landing/landing.component';

import { DoctorResolver } from '@core/resolver/doctor.resolver';

import { AuthGuard } from '@core/guards/auth.guard';
import { RoleGuard } from '@core/guards/role.guard';
import { NotLoggedInGurad } from '@core/guards/notloggedin.guard';
import { PageNotFoundComponent } from '@core/components/page-not-found/page-not-found.component';
import { DoctorPatientViewComponent } from '@features/doctor-patient-view/doctor-patient-view.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: LandingComponent,
        canActivate: [NotLoggedInGurad],
    },
    {
        path: '',
        loadChildren: () =>
            import('@features/user-auth/user-auth.module').then(
                ({ UserAuthModule }) => UserAuthModule
            ),
    },
    {
        path: 'patient',
        canLoad: [RoleGuard],
        canActivate: [RoleGuard],
        data: {
            expectedRole: 'patient',
        },
        loadChildren: () =>
            import('@features/patient/patient.module').then(
                ({ PatientModule }) => PatientModule
            ),
    },
    {
        path: 'doctor',
        canLoad: [RoleGuard],
        canActivate: [AuthGuard],
        data: {
            expectedRole: 'doctor',
        },
        loadChildren: () =>
            import('@features/doctor/doctor.module').then(
                ({ DoctorModule }) => DoctorModule
            ),
    },
    {
        path: 'doctors/:username',
        canActivate: [RoleGuard],
        data: {
            expectedRole: 'patient',
        },
        component: DoctorPatientViewComponent,
        resolve: { doctor: DoctorResolver },
    },
    {
        path: 'manager',
        canLoad: [RoleGuard],
        canActivate: [RoleGuard],
        data: {
            expectedRole: 'manager',
        },
        loadChildren: () =>
            import('@features/manager/manager.module').then(
                ({ ManagerModule }) => ManagerModule
            ),
    },
    {
        path: 'not-found',
        component: PageNotFoundComponent,
    },
    { path: '**', redirectTo: 'not-found' },
];

@NgModule({
    providers: [],
    imports: [
        RouterModule.forRoot(appRoutes, {
            preloadingStrategy: PreloadAllModules,
            scrollPositionRestoration: 'top',
            anchorScrolling: 'enabled',
            enableTracing: false,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
