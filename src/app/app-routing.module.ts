import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './features/welcome/welcome.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';

export const appRoutes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: '**', component: PageNotFoundComponent },
    // list more components here
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            preloadingStrategy: PreloadAllModules,
            enableTracing: true,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
