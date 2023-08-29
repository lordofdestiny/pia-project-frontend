import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewVisitorComponent } from './new-visitor.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { LoggedInGurad } from '@core/guards/loggedin.guard';
import { LogoutGuard } from '@core/guards/logout.guard';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
    { path: '', component: NewVisitorComponent },
    {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [LoggedInGurad],
        data: { manager: false },
    },
    {
        path: 'manager/login',
        component: LoginPageComponent,
        canActivate: [LoggedInGurad],
        data: { manager: true },
    },
    { path: 'register', component: RegisterPageComponent },
    {
        path: 'logout',
        component: NewVisitorComponent,
        canActivate: [AuthGuard, LogoutGuard],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NewVisitorRoutingModule {}
