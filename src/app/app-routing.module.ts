import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { LoginPageComponent } from './features/login-page/login-page.component';

import { LogoutGuard } from '@core/guards/logout.guard';
import { AuthGuard } from '@core/guards/auth.guard';
import { LoggedInGurad } from '@core/guards/loggedin.guard';
import { RegisterPageComponent } from '@features/register-page/register-page.component';

export const appRoutes: Routes = [
    { path: '', component: LandingPageComponent },
    {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [LoggedInGurad],
        data: { manager: false },
    },
    {
        path: 'register',
        component: RegisterPageComponent,
        canActivate: [LoggedInGurad],
    },
    {
        path: 'manager/login',
        component: LoginPageComponent,
        canActivate: [LoggedInGurad],
        data: { manager: true },
    },
    {
        path: 'logout',
        component: LandingPageComponent,
        canActivate: [AuthGuard, LogoutGuard],
    },
    { path: '**', component: PageNotFoundComponent },
];

@NgModule({
    providers: [],
    imports: [
        RouterModule.forRoot(appRoutes, {
            preloadingStrategy: PreloadAllModules,
            enableTracing: false,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
