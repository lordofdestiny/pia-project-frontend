import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RoleGuard } from "@core/guards/role.guard";

import { AppointmentsResolver } from "@core/resolvers/appointments.resolver";
import { SpecializationsResolver } from "@core/resolvers/specializations.resolver";

import { DoctorComponent } from "./doctor.component";
import { AppointmentsComponent } from "./pages/appointments/appointments.component";
import { MiscellaneousComponent } from "./pages/miscellaneous/miscellaneous.component";
import { DoctorProfileComponent } from "./pages/doctor-profile/doctor-profile.component";

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
                path: "appointments",
                resolve: {
                    appointments: AppointmentsResolver,
                },
                runGuardsAndResolvers: "always",
                component: AppointmentsComponent,
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
