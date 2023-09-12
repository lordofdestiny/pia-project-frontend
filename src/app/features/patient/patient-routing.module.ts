import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PatientComponent } from "./patient.component";
import { PatientProfileComponent } from "./pages/patient-profile/patient-profile.component";
import { DoctorsComponent } from "./pages/doctors/doctors.component";
import { AppointmentsReportsComponent } from "./pages/appointments-reports/appointments-reports.component";
import { AppointmentsResolver } from "@core/resolvers/appointments.resolver";

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
                component: AppointmentsReportsComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PatientRoutingModule {}
