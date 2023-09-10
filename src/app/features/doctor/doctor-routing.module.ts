import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DoctorComponent } from "./doctor.component";
import { DoctorProfileComponent } from "./pages/doctor-profile/doctor-profile.component";
import { RoleGuard } from "@core/guards/role.guard";
import { SpecializationsResolver } from "@core/resolvers/specializations.resolver";
import { MiscellaneousComponent } from "./pages/miscellaneous/miscellaneous.component";

const routes: Routes = [
    {
        path: "",
        canActivate: [RoleGuard],
        data: {
            expectedRole: "doctor",
        },
        component: DoctorComponent,
        children: [
            {
                path: "",
                pathMatch: "full",
                redirectTo: "profile",
            },
            {
                path: "profile",
                resolve: {
                    specializations: SpecializationsResolver,
                },
                runGuardsAndResolvers: "always",
                component: DoctorProfileComponent,
            },
            {
                path: "miscellaneous",
                component: MiscellaneousComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DoctorRoutingModule {}
