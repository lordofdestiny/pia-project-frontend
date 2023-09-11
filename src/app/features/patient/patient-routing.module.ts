import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PatientComponent } from "./patient.component";
import { PatientProfileComponent } from "./pages/patient-profile/patient-profile.component";
import { DoctorsComponent } from "./pages/doctors/doctors.component";
import { PatientAppointmentsComponent as PatientAppointmentsComponent } from "./pages/patient-appointments/patient-appointments.component";

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
                component: PatientAppointmentsComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PatientRoutingModule {}
