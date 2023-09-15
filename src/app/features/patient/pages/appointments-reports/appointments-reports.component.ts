import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { AppointmentBase, AppointmentPatient } from "@core/models/appointment";
import { Patient } from "@core/models/users";
import { AppointmentsService } from "@core/services/appointments.service";
import { AuthService } from "@core/services/auth.service";
import { moment } from "@core/utils/moment";
import { ActionResultDialogComponent } from "@shared/components/action-success-dialog/action-success-dialog.component";

class DefaultValueMap<K, V> extends Map<K, V> {
    constructor(private defaultValue: V, entries?: Iterable<readonly [K, V]> | null) {
        super(entries);
    }

    override get(key: K): V {
        if (!this.has(key)) {
            this.set(key, this.defaultValue);
        }
        return super.get(key) as V;
    }
}

@Component({
    selector: "app-appointments",
    templateUrl: "./appointments-reports.component.html",
    styleUrls: ["./appointments-reports.component.css"],
})
export class AppointmentsReportsComponent implements OnInit {
    appointments: AppointmentPatient[] = this.route.snapshot.data["appointments"].slice();
    loadingStates: Map<number, boolean> = new DefaultValueMap<number, boolean>(false);

    @ViewChild("appointmentList") appointmentList?: ElementRef<HTMLTableElement>;
    constructor(
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private authService: AuthService,
        private appointmentsService: AppointmentsService
    ) {}

    private appointmentEnd({ datetime, examination: { duration } }: AppointmentBase<any>) {
        return moment(datetime).add(duration, "minutes").toDate().getTime();
    }
    unfulfilledAppointments(): AppointmentPatient[] {
        return this.appointments.filter(
            (appointment) => this.appointmentEnd(appointment) >= new Date().getTime()
        );
    }
    fulfilledAppointments(): AppointmentPatient[] {
        return this.appointments.filter(
            (appointment) => this.appointmentEnd(appointment) < new Date().getTime()
        );
    }

    ascDateSort = (a: AppointmentBase<any>, b: AppointmentBase<any>) =>
        a.datetime.getTime() - b.datetime.getTime();
    dscDateSort = (a: AppointmentBase<any>, b: AppointmentBase<any>) =>
        b.datetime.getTime() - a.datetime.getTime();

    handleCancel(appointment: AppointmentPatient) {
        this.appointmentsService.patientCancelAppointment(appointment.id).subscribe({
            next: this.handleCancelSuccess.bind(this, appointment),
            error: this.handleCancelFailed.bind(this),
        });
    }

    handleCancelSuccess(appointment: AppointmentPatient) {
        this.dialog.open(ActionResultDialogComponent, {
            panelClass: "dialog-color",
            data: {
                success: true,
                message: "Appointment canceled successfully",
            },
        });
        this.appointments.splice(this.appointments.indexOf(appointment), 1);
        this.appointments = [...this.appointments];
    }

    handleCancelFailed(error: any) {
        this.dialog.open(ActionResultDialogComponent, {
            panelClass: "dialog-color",
            data: {
                success: false,
                message: "Failed to cancel appointment",
            },
        });
    }

    requestReport(appointment: AppointmentPatient, index: number) {
        this.loadingStates.set(index, true);
        this.appointmentsService.requestPdfReport(appointment.id).subscribe({
            next: this.handleReportRequestSuccess.bind(this),
            error: this.handleReportRequestFailed.bind(this),
            complete: () => this.loadingStates.set(index, false),
        });
    }

    handleReportRequestSuccess() {
        this.dialog.open(ActionResultDialogComponent, {
            panelClass: "dialog-color",
            data: {
                success: true,
                message: "Report generated. Please check your email for the report.",
            },
        });
    }

    handleReportRequestFailed(err: any) {
        this.dialog.open(ActionResultDialogComponent, {
            panelClass: "dialog-color",
            data: {
                success: false,
                message: "Failed to request the report",
            },
        });
    }

    requestAll() {
        this.loadingStates.set(-1, true);
        this.appointmentsService.requestFullPdfReport().subscribe({
            next: this.handleReportRequestSuccess.bind(this),
            error: this.handleReportRequestFailed.bind(this),
            complete: () => this.loadingStates.set(-1, false),
        });
    }

    ngOnInit(): void {}
}
