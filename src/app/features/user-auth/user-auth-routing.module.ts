import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from '../landing/landing.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { NotLoggedInGurad as NotLoggedInGuard } from '@core/guards/notloggedin.guard';
import { LogoutGuard } from '@core/guards/logout.guard';
import { AuthGuard } from '@core/guards/auth.guard';
import { EditPasswordComponent } from './pages/edit-password/edit-password.component';

const routes: Routes = [
    {
        path: 'login',
        title: 'Login',
        component: LoginPageComponent,
        canActivate: [NotLoggedInGuard],
        data: { manager: false },
    },
    {
        path: 'manager/login',
        title: 'Manager Login',
        component: LoginPageComponent,
        canActivate: [NotLoggedInGuard],
        data: { manager: true },
    },
    {
        path: 'register',
        title: 'Register',
        canActivate: [NotLoggedInGuard],
        component: RegisterPageComponent,
    },
    {
        path: 'edit-password',
        title: 'Edit Password',
        component: EditPasswordComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'logout',
        component: LandingComponent,
        canActivate: [AuthGuard, LogoutGuard],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserAuthRoutingModule {}
