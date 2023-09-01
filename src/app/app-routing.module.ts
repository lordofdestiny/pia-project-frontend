import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LandingComponent } from '@features/landing/landing.component';
import { NotLoggedInGurad } from '@core/guards/notloggedin.guard';
import { AuthGuard } from '@core/guards/auth.guard';
import { RoleGuard } from '@core/guards/role.guard';

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
        canActivate: [AuthGuard, RoleGuard],
        data: {
            expectedRole: 'patient',
        },
        loadChildren: () =>
            import('@features/patient/patient.module').then(
                ({ PatientModule }) => PatientModule
            ),
    },
    { path: '**', redirectTo: 'not-found' },
];

@NgModule({
    providers: [],
    imports: [
        RouterModule.forRoot(appRoutes, {
            preloadingStrategy: PreloadAllModules,
            scrollPositionRestoration: 'top',
            enableTracing: false,
            anchorScrolling: 'enabled',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
