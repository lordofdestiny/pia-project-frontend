import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const appRoutes: Routes = [
  // { path: '', component: HomeComponent }
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
