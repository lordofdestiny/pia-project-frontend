import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './landing.component';

const routes: Routes = [
    // {
    //     path: '',
    //     redirectTo: 'welcome',
    //     pathMatch: 'full',
    //     component: WelcomeComponent,w
    // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WelcomeRoutingModule {}
