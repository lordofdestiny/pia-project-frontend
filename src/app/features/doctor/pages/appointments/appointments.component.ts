import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Doctor, Patient } from "@core/models/users";

import { DialogService } from "primeng/dynamicdialog";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventImpl } from "@fullcalendar/core/internal";
import { CalendarOptions, EventInput } from "@fullcalendar/core";

import { moment } from "@core/utils/moment";

import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "@core/services/auth.service";
import { AppointmentsService } from "@core/services/appointments.service";
import { AppointmentDoctor, AppointmentReport } from "@core/models/appointment";
import { ActionResultDialogComponent } from "@shared/components/action-success-dialog/action-success-dialog.component";
import { CalendarEventPopupComponent } from "@features/doctor/components/calendar-event-popup/calendar-event-popup.component";
import { AddReportPopupComponent } from "@features/doctor/components/add-report-popup/add-report-popup.component";

@Component({
    selector: "app-appointments",
    templateUrl: "./appointments.component.html",
    styleUrls: ["./appointments.component.css"],
    providers: [DialogService],
})
export class AppointmentsComponent implements OnInit {
    appointments: AppointmentDoctor[] = this.route.snapshot.data["appointments"];
    calendarEvents: EventInput[] = [];

    private generateColor(index: number) {
        const colorCount = 12;
        const hue = ((index % colorCount) * 360) / (colorCount - 1);
        return `hsl(${hue}, 100%, 65%)`;
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dialogService: DialogService,
        private authService: AuthService,
        private dialog: MatDialog,
        private appointmentService: AppointmentsService
    ) {
        this.calendarEvents.push(
            ...this.upcommingAppointments.map((appointment, i) => {
                const { datetime, examination } = appointment;

                return {
                    title: `${examination.name}`,
                    start: datetime,
                    overlap: false,
                    end: moment(datetime).add(examination.duration, "minutes").toDate(),
                    className: ["eventWithComment"],
                    color: this.generateColor(i),
                    textColor: "black",
                    extendedProps: {
                        data: appointment,
                        vacation: false,
                    },
                };
            }),
            ...((<Doctor>this.authService.user).vacations?.map(({ start_date, end_date }) => ({
                title: "Vacation",
                start: start_date,
                end: end_date,
                textColor: "var(--accent)",
                backgroundColor: "#3f51b580",
                extendedProps: {
                    vacation: true,
                },
            })) ?? [])
        );
    }

    get upcommingAppointments() {
        return this.appointments
            .filter(({ datetime }) => new Date(datetime) > new Date())
            .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
    }

    get pastAppointments() {
        return this.appointments
            .filter(({ datetime, report }) => datetime <= new Date() && report === null)
            .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
    }

    calendarOptions: CalendarOptions = {
        initialView: "dayGridTwoWeek",
        initialDate: new Date(),
        firstDay: new Date().getDay(),
        validRange(nowDate) {
            return {
                start: nowDate,
                end: moment(nowDate).startOf("day").add(2, "weeks").toDate(),
            };
        },
        businessHours: {
            startTime: "07:00",
            endTime: "23:00",
        },
        slotMinTime: "07:00",
        nowIndicator: true,
        slotMaxTime: "23:00",
        height: "70vh",
        allDaySlot: false,
        slotDuration: "00:15:00",
        slotLabelInterval: "00:30:00",
        scrollTime: `${new Date().getHours()}:00`,
        slotLabelFormat(arg) {
            const date = moment(arg.date);
            const min = date.minute();
            if (min === 0) return date.format("HH:mm");
            return date.format("mm");
        },
        eventClick: (info) => {
            if (info.event.extendedProps["vacation"]) return;
            this.handleEventClick(info.event.extendedProps["data"], info.event);
        },
        plugins: [dayGridPlugin, timeGridPlugin],
        headerToolbar: {
            left: "",
            center: "title",
            right: "prev,next",
        },
        locale: "sh",
        titleFormat: { year: "numeric", month: "long", day: "numeric" },
        events: this.calendarEvents,
        views: {
            dayGridTwoWeek: {
                type: "timeGrid",
                duration: { weeks: 1 },
            },
        },
    };
    handleEventClick(appointment: AppointmentDoctor, sourceEvent: EventImpl) {
        const subscription = this.dialogService
            .open(CalendarEventPopupComponent, {
                data: {
                    appointment,
                },
                header: `Appointment`,
                draggable: false,
                resizable: false,
                styleClass: "edit-image-modal",
                width: "70%",
                contentStyle: {
                    overflow: "auto",
                    backgroundColor: "var(--bg-color)",
                },
                modal: true,
                baseZIndex: 10000,
            })
            .onClose.subscribe((event: CalendarPopupEvent) => {
                if (event.action === "seeAll") {
                    this.router.navigate(["/patients", event.data.id]);
                }
                if (event.action === "cancel") {
                    const { appointment, reason } = event.data;
                    this.handleCancelAppointment(appointment, reason, sourceEvent);
                }

                subscription.unsubscribe();
            });
    }

    handleCancelAppointment(appointmentId: string, reason: string, sourceEvent: EventImpl) {
        this.appointmentService.doctorCancelAppointment(appointmentId, reason).subscribe({
            next: this.handleCancelAppointmentSuccess.bind(this, appointmentId, sourceEvent),
            error: this.handleCancelAppointmentError.bind(this),
        });
    }

    handleCancelAppointmentSuccess(appointmentId: string, sourceEvent: EventImpl) {
        this.appointments = this.appointments.filter(({ id }) => id !== appointmentId);
        sourceEvent.remove();
        this.dialog.open(ActionResultDialogComponent, {
            panelClass: "dialog-color",
            data: {
                success: true,
                message: "Appointment canceled successfully!",
            },
        });
    }

    handleCancelAppointmentError() {
        this.dialog.open(ActionResultDialogComponent, {
            panelClass: "dialog-color",
            data: {
                success: false,
                message: "Failed to cancel this appointment!",
            },
        });
    }

    showAddReportDialog(appointment: AppointmentDoctor, index: number) {
        const subscription = this.dialogService
            .open(AddReportPopupComponent, {
                data: {
                    appointment,
                },
                header: `Add report`,
                draggable: false,
                resizable: false,
                styleClass: "edit-image-modal",
                width: "80%",
                contentStyle: {
                    overflow: "auto",
                    backgroundColor: "var(--bg-color)",
                },
                modal: true,
                baseZIndex: 10000,
            })
            .onClose.subscribe((event: { action: string; report: AppointmentReport }) => {
                if (event?.action === "confirm") {
                    this.handlePublishReport(appointment.id, index, event.report);
                }
                subscription.unsubscribe();
            });
    }

    handlePublishReport(appointmentId: string, index: number, report: AppointmentReport) {
        this.appointmentService.doctorPublishReport(appointmentId, report).subscribe({
            next: this.handlePublishReportSuccess.bind(this, index),
            error: this.handlePublishReportError.bind(this),
        });
    }

    handlePublishReportSuccess(index: number, appointment: AppointmentDoctor) {
        this.appointments = [
            ...this.appointments.filter(({ id }) => id !== appointment.id),
            appointment,
        ];
        this.dialog.open(ActionResultDialogComponent, {
            panelClass: "dialog-color",
            data: {
                success: true,
                message: "Report saved successfully!",
            },
        });
    }

    handlePublishReportError(error: any) {
        this.dialog.open(ActionResultDialogComponent, {
            panelClass: "dialog-color",
            data: {
                success: false,
                message: "Failed to publish this report!",
            },
        });
    }

    ngOnInit(): void {}
}

type CalendarPopupEvent =
    | {
          action: "seeAll";
          data: Pick<Patient, "id" | "username" | "first_name" | "last_name">;
      }
    | {
          action: "cancel";
          data: { appointment: string; reason: string };
      }
    | {
          action: "none";
      };
