import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

// Angular Material
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";

// Ngx-Bootstrap
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

// PrimeNG
import { ProgressSpinnerModule } from "primeng/progressspinner";

import { SharedModule } from "@shared/shared.module";
import { PatientComponent } from "./patient.component";
import { PatientRoutingModule } from "./patient-routing.module";
import { PatientProfileComponent } from "./pages/patient-profile/patient-profile.component";
import { DoctorsComponent } from "./pages/doctors/doctors.component";
import { AppointmentsReportsComponent } from "./pages/appointments-reports/appointments-reports.component";
import { DoctorPatientViewComponent } from "./pages/doctor-patient-view/doctor-patient-view.component";
@NgModule({
    declarations: [
        PatientComponent,
        PatientProfileComponent,
        DoctorsComponent,
        DoctorPatientViewComponent,
        AppointmentsReportsComponent,
    ],
    imports: [
        // Angular
        CommonModule,
        FormsModule,
        // Angular Material
        MatIconModule,
        MatTabsModule,
        MatDialogModule,
        MatButtonModule,
        MatTableModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        // Ngx-Bootstrap
        TimepickerModule.forRoot(),
        BsDatepickerModule.forRoot(),
        // PrimeNG
        ProgressSpinnerModule,
        // My Modules
        SharedModule,
        PatientRoutingModule,
    ],
})
export class PatientModule {}
