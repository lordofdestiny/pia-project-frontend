import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerComponent } from './manager.component';
import { ManagerProfileComponent } from './pages/manager-profile/manager-profile.component';

const routes: Routes = [
    {
        path: '',
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
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ManagerRoutingModule {}
