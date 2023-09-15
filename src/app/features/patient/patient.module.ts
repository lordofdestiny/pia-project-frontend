import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { MatBadgeModule } from "@angular/material/badge";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSnackBarModule } from "@angular/material/snack-bar";

// Ngx-Bootstrap
import { TimepickerModule } from "ngx-bootstrap/timepicker";
//FullCalendar
import { FullCalendarModule } from "@fullcalendar/angular";
// PrimeNG
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { DynamicDialogModule } from "primeng/dynamicdialog";

import { SharedModule } from "@shared/shared.module";
import { PatientComponent } from "./patient.component";
import { PatientRoutingModule } from "./patient-routing.module";
import { PatientProfileComponent } from "./pages/patient-profile/patient-profile.component";
import { DoctorsComponent } from "./pages/doctors/doctors.component";
import { AppointmentsReportsComponent } from "./pages/appointments-reports/appointments-reports.component";
import { DoctorPatientViewComponent } from "./pages/doctor-patient-view/doctor-patient-view.component";
import { NotificationsComponent } from "./pages/notifications/notifications.component";
import { EditAppointmentTimeComponent } from "./components/edit-appointment-time/edit-appointment-time.component";
@NgModule({
    declarations: [
        PatientComponent,
        PatientProfileComponent,
        DoctorsComponent,
        DoctorPatientViewComponent,
        AppointmentsReportsComponent,
        NotificationsComponent,
        EditAppointmentTimeComponent,
    ],
    imports: [
        // Angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // Angular Material
        MatIconModule,
        MatTabsModule,
        MatDialogModule,
        MatButtonModule,
        MatTableModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatBadgeModule,
        MatDatepickerModule,
        MatSnackBarModule,
        // Ngx-Bootstrap
        TimepickerModule.forRoot(),
        //FullCalendar
        FullCalendarModule,
        // PrimeNG
        ProgressSpinnerModule,
        DynamicDialogModule,
        // My Modules
        SharedModule,
        PatientRoutingModule,
    ],
})
export class PatientModule {}
