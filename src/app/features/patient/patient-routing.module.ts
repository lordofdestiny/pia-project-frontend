import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PatientComponent } from "./patient.component";
import { PatientProfileComponent } from "./pages/patient-profile/patient-profile.component";
import { DoctorsComponent } from "./pages/doctors/doctors.component";
import { AppointmentsReportsComponent } from "./pages/appointments-reports/appointments-reports.component";
import { AppointmentsResolver } from "@core/resolvers/appointments.resolver";
import { NotificationsResolver } from "@core/resolvers/notifications.resolver";
import { NotificationsComponent } from "./pages/notifications/notifications.component";

const routes: Routes = [
    {
        path: "",
        component: PatientComponent,
        children: [
            {
                path: "",
                pathMatch: "full",
                redirectTo: "profile",
            },
            {
                path: "profile",
                component: PatientProfileComponent,
            },
            {
                path: "doctors",
                component: DoctorsComponent,
            },
            {
                path: "appointments",
                resolve: {
                    appointments: AppointmentsResolver,
                },
                runGuardsAndResolvers: "always",
                component: AppointmentsReportsComponent,
            },
            {
                path: "notifications",
                resolve: {
                    notifications: NotificationsResolver,
                },
                runGuardsAndResolvers: "always",
                component: NotificationsComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PatientRoutingModule {}
