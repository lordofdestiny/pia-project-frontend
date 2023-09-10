import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { LandingComponent } from "@features/landing/landing.component";

import { DoctorResolver } from "@core/resolvers/doctor.resolver";

import { AuthGuard } from "@core/guards/auth.guard";
import { RoleGuard } from "@core/guards/role.guard";
import { NotLoggedInGurad } from "@core/guards/notloggedin.guard";
import { PageNotFoundComponent } from "@core/components/page-not-found/page-not-found.component";
import { SpecializationsResolver } from "@core/resolvers/specializations.resolver";
import { DoctorPatientViewComponent } from "@features/patient/pages/doctor-patient-view/doctor-patient-view.component";

export const appRoutes: Routes = [
    {
        path: "",
        component: LandingComponent,
        canActivate: [NotLoggedInGurad],
    },
    {
        path: "",
        loadChildren: () =>
            import("@features/user-auth/user-auth.module").then(
                ({ UserAuthModule }) => UserAuthModule
            ),
    },
    {
        path: "patient",
        canLoad: [RoleGuard],
        canActivate: [RoleGuard],
        data: {
            expectedRole: "patient",
        },
        loadChildren: () =>
            import("@features/patient/patient.module").then(({ PatientModule }) => PatientModule),
    },
    {
        path: "doctors/:username",
        canLoad: [RoleGuard],
        canActivate: [RoleGuard],
        data: {
            expectedRole: "patient",
        },
        component: DoctorPatientViewComponent,
        resolve: {
            doctor: DoctorResolver,
            specializations: SpecializationsResolver,
        },
    },
    {
        path: "doctor",
        canLoad: [RoleGuard],
        canActivate: [RoleGuard],
        data: {
            expectedRole: "doctor",
        },
        loadChildren: () =>
            import("@features/doctor/doctor.module").then(({ DoctorModule }) => DoctorModule),
    },
    {
        path: "manager",
        canLoad: [RoleGuard],
        canActivate: [AuthGuard, RoleGuard],
        data: {
            expectedRole: "manager",
        },
        loadChildren: () =>
            import("@features/manager/manager.module").then(({ ManagerModule }) => ManagerModule),
    },
    {
        path: "not-found",
        component: PageNotFoundComponent,
    },
    { path: "**", redirectTo: "not-found" },
];

@NgModule({
    providers: [],
    imports: [
        RouterModule.forRoot(appRoutes, {
            preloadingStrategy: PreloadAllModules,
            scrollPositionRestoration: "top",
            anchorScrolling: "enabled",
            enableTracing: false,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
