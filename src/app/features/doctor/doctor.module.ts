import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Angular Material
import { MatNativeDateModule } from "@angular/material/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatListModule } from "@angular/material/list";

// FullCalendar
import { FullCalendarModule } from "@fullcalendar/angular";

// PrimeNG
import { ButtonModule } from "primeng/button";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ProgressSpinnerModule } from "primeng/progressspinner";

// My modules
import { SharedModule } from "@shared/shared.module";
import { DoctorComponent } from "./doctor.component";
import { DoctorRoutingModule } from "./doctor-routing.module";
import { AppointmentsComponent } from "./pages/appointments/appointments.component";
import { DoctorProfileComponent } from "./pages/doctor-profile/doctor-profile.component";
import { MiscellaneousComponent } from "./pages/miscellaneous/miscellaneous.component";
import { PickExaminationsComponent } from "./components/pick-examinations/pick-examinations.component";
import { RequestExaminationComponent } from "./components/request-examination/request-examination.component";
import { CalendarEventPopupComponent } from "./components/calendar-event-popup/calendar-event-popup.component";
import { DatepickerHeader, VacationsComponent } from "./components/vacations/vacations.component";
import { PatientPastAppointmentsComponent } from "./pages/patient-past-appointments/patient-past-appointments.component";
import { AddReportPopupComponent } from './components/add-report-popup/add-report-popup.component';

@NgModule({
    declarations: [
        DoctorComponent,
        DoctorProfileComponent,
        PickExaminationsComponent,
        MiscellaneousComponent,
        RequestExaminationComponent,
        VacationsComponent,
        DatepickerHeader,
        AppointmentsComponent,
        CalendarEventPopupComponent,
        PatientPastAppointmentsComponent,
        AddReportPopupComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        //Angular material
        MatTabsModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatTableModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatListModule,
        MatDividerModule,
        // PrimeNG
        DynamicDialogModule,
        ConfirmDialogModule,
        ButtonModule,
        ProgressSpinnerModule,
        //FullCalendar
        FullCalendarModule, // register FullCalendar with your app
        //My modules
        SharedModule,
        DoctorRoutingModule,
    ],
})
export class DoctorModule {}
