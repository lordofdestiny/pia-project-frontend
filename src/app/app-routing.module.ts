import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';

export const appRoutes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('@features/new-visitor/new-visitor.module').then(
                ({ NewVisitorModule }) => NewVisitorModule
            ),
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
