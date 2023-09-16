import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { animate, keyframes, style, transition, trigger } from "@angular/animations";

import { MatDialog } from "@angular/material/dialog";

import { CalendarOptions, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionsPugin from "@fullcalendar/interaction";
import { FullCalendarComponent } from "@fullcalendar/angular";

import { DialogService } from "primeng/dynamicdialog";

import { moment } from "@core/utils/moment";
import { Doctor } from "@core/models/users";
import { Examination } from "@core/models/specialization";
import { AppointmentBase, AppointmentPatient } from "@core/models/appointment";
import { AuthService } from "@core/services/auth.service";
import { AppointmentsService } from "@core/services/appointments.service";
import { ActionResultDialogComponent } from "@shared/components/action-success-dialog/action-success-dialog.component";
import { EditAppointmentTimeComponent } from "@features/patient/components/edit-appointment-time/edit-appointment-time.component";
import { ConfirmationService } from "primeng/api";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import {
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
    MomentDateAdapter,
} from "@angular/material-moment-adapter";
import { MatSnackBar } from "@angular/material/snack-bar";

const MY_FORMATS = {
    parse: {
        dateInput: "DD.MM.YYYY.",
    },
    display: {
        dateInput: "DD.MM.YYYY.",
        monthYearLabel: "MMMM YYYY",
        dateA11yLabel: "LL",
        monthYearA11yLabel: "MMMM YYYY",
    },
};

@Component({
    selector: "app-doctor-patient-view",
    templateUrl: "./doctor-patient-view.component.html",
    styleUrls: ["./doctor-patient-view.component.css"],

    providers: [
        DialogService,
        ConfirmationService,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
    animations: [
        trigger("flyInOut", [
            transition(":enter", [
                animate(
                    500,
                    keyframes([
                        style({ transform: "translateX(100%)", opacity: 0 }),
                        style({ transform: "translateX(0)", opacity: 1 }),
                    ])
                ),
            ]),
        ]),
        trigger("flyInOut", [
            transition(":leave", [
                animate(500, keyframes([style({ opacity: 0 }), style({ opacity: 1 })])),
            ]),
        ]),
    ],
})
export class DoctorPatientViewComponent implements OnInit {
    doctor: Doctor = this.route.snapshot.data["doctor"];

    minDate = (() => {
        const date = moment();
        if (date.hour() >= 23) {
            date.add(1, "days").startOf("day");
            date.set({
                hour: 7,
                minute: 0,
            });
        }
        return date.toDate();
    })();

    minTime = moment(this.minDate)
        .set({
            hour: 7,
            minute: 0,
        })
        .toDate();
    maxTime = moment(this.minDate)
        .set({
            hour: 23,
            minute: 0,
        })
        .toDate();

    initialDate = moment(this.minDate).startOf("day").toDate();
    initialTime = moment(this.minDate).add(1, "hour").startOf("hour").toDate();

    constructor(
        private route: ActivatedRoute,
        protected router: Router,
        private dialog: MatDialog,
        private dialogService: DialogService,
        private authService: AuthService,
        private _snackBar: MatSnackBar,
        private appointmentsService: AppointmentsService
    ) {
        let minutes = this.initialTime.getMinutes();
        minutes = Math.ceil(minutes / 5) * 5;
        this.initialTime.setMinutes(minutes);

        if (this.initialTime.getHours() < this.minTime.getHours()) {
            this.initialTime.setHours(this.minTime.getHours());
            this.initialTime.setMinutes(0);
        }
        if (this.initialTime.getHours() > this.maxTime.getHours()) {
            this.initialTime.setHours(this.minTime.getHours());
            this.initialTime.setMinutes(0);
        }
    }

    handleExamChange(exam: Examination) {
        if (!exam) return;
        this.appointmentModel.time = this.initialTime;
        this.maxTime = moment()
            .set({
                hour: 23,
                minute: 0,
            })
            .add(-exam.duration, "minutes")
            .toDate();
    }

    @ViewChild("makeAppointment") makeAppointment?: ElementRef<HTMLElement>;
    handleSelectedExamination(examination: Examination) {
        this.appointmentModel = { ...this.appointmentModel, examination };
        this.maxTime = moment()
            .set({
                hour: 23,
                minute: 0,
            })
            .add(-examination.duration, "minutes")
            .toDate();
        setTimeout(() =>
            this.makeAppointment?.nativeElement.scrollIntoView({ behavior: "smooth" })
        );
    }

    appointmentModel: {
        examination: Examination;
        date: Date;
        time: Date;
    } = {
        examination: null as any,
        date: this.initialDate,
        time: this.initialTime,
    };

    @ViewChild("appointmentForm") appointmentForm?: NgForm;
    @ViewChild("subtitleExams") subtitleExams?: ElementRef<HTMLElement>;

    restModelAndForm() {
        this.appointmentModel = {
            examination: null as any,
            date: this.initialDate,
            time: this.initialTime,
        };
        this.appointmentForm?.resetForm({
            ...this.appointmentModel,
        });
    }

    handleCancelNewAppointment() {
        this.restModelAndForm();
        this.subtitleExams?.nativeElement.scrollIntoView({ behavior: "smooth" });
    }

    attemptAppointment() {
        const { examination, date, time } = this.appointmentModel;
        const datetime = moment(date)
            .set({
                hour: time.getHours(),
                minute: time.getMinutes(),
            })
            .toDate();
        this.appointmentsService
            .attemptAppointment({
                doctorId: this.doctor.id,
                patientId: this.authService.user.id!,
                examinationId: examination!.id!,
                datetime,
            })
            .subscribe({
                next: this.handleAttemptedAppointmentSuccess.bind(this),
                error: this.handleAttemptedAppointmentError.bind(this),
                complete: () => this.calendar?.getApi().getEventById("new")?.remove(),
            });
    }

    handleAttemptedAppointmentSuccess(appointment: AppointmentPatient) {
        this.restModelAndForm();
        this.doctor.appointments = [...(this.doctor.appointments ?? []), appointment];
        this.calendarEvents?.push({
            start: appointment.datetime,
            end: moment(appointment.datetime)
                .add(appointment.examination.duration, "minutes")
                .toDate(),
            allDay: false,
            color: this.generateColor(Math.round(Math.random() * 24)),
        });

        this.subtitleExams?.nativeElement.scrollIntoView({ behavior: "smooth" });
        this.dialog.open(ActionResultDialogComponent, {
            panelClass: "dialog-color",
            data: {
                success: true,
                message: "Appointment made successfully",
            },
        });
    }
    handleAttemptedAppointmentError(error: any) {
        this.calendar?.getApi().getEventById("new")?.remove();
        this.dialog.open(ActionResultDialogComponent, {
            panelClass: "dialog-color",
            data: {
                success: false,
                message: "Appointment could not be made.\n Doctor is not available at that time.",
            },
        });
    }

    @ViewChild("calendar") calendar?: FullCalendarComponent;

    private generateColor(index: number) {
        const colorCount = 12;
        const hue = ((index % colorCount) * 360) / (colorCount - 1);
        return `hsl(${hue}, 100%, 85%)`;
    }

    calendarEvents?: EventInput[] = [
        ...(this.doctor.vacations?.map(({ start_date: start, end_date: end }) => {
            return {
                title: "Vacation",
                start: moment(start).startOf("day").toDate(),
                end: moment(end).add(1, "days").startOf("day").toDate(),
                allDay: true,
                display: "background",
                backgroundColor: "#3f51b580",
            };
        }) ?? []),
        ...(this.doctor.appointments?.map(({ datetime, examination }) => {
            return {
                start: datetime,
                end: moment(datetime).add(examination.duration, "minutes").toDate(),
                allDay: false,
                textColor: "black",
                backgroundColor: this.generateColor(Math.round(Math.random() * 24)),
            };
        }) ?? []),
    ];

    calendarOptions: CalendarOptions = {
        initialView: "dayGridMonth",
        firstDay: 1,
        validRange: {
            start: this.minDate,
        },
        timeZone: "local",
        businessHours: {
            startTime: "07:00",
            endTime: "23:00",
            daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
        },
        buttonText: {
            month: "Full Month",
        },
        height: "70vh",
        slotMinTime: "07:00",
        slotMaxTime: "23:00",
        slotDuration: "00:30:00",
        slotLabelInterval: "00:15:00",
        nowIndicator: true,
        allDaySlot: false,
        scrollTime: `${new Date().getHours()}:00`,
        slotLabelFormat(arg) {
            const date = moment(arg.date);
            const min = date.minute();
            if (min === 0) return date.format("HH:mm");
            return date.format("mm");
        },
        dateClick: (info) => {
            if (info.view.type === "dayGridMonth") {
                this.calendar?.getApi().changeView("timeGridOneDay", info.dateStr);
            }
            if (info.view.type === "timeGridOneDay") {
                this.handleTimeGridOneDayClick(moment(info.date).toDate());
            }
        },
        eventTimeFormat: {
            hour: "numeric",
            minute: "2-digit",
            meridiem: false,
        },
        eventDidMount: function (info) {
            if (info.event.textColor) {
                info.el.style.color = info.event.textColor;
            }
        },
        displayEventEnd: true,
        plugins: [dayGridPlugin, timeGridPlugin, interactionsPugin],
        headerToolbar: {
            left: "prev,today,next",
            center: "title",
            right: "dayGridMonth",
        },
        locale: "sh",
        titleFormat: { year: "numeric", month: "long", day: "2-digit" },
        events: this.calendarEvents,
        views: {
            timeGridOneDay: {
                type: "timeGrid",
                duration: { days: 7 },
            },
        },
    };

    appointmentEnd(appointment: Pick<AppointmentBase<any>, "datetime" | "examination">) {
        return moment(appointment.datetime).add(appointment.examination.duration, "minutes");
    }

    handleTimeGridOneDayClick(date: Date) {
        if (
            // Appointment can't be made more less than 1 hour in advance
            moment(date).isSame(moment().startOf("day"), "day") &&
            moment(date).isSameOrBefore(moment().add(1, "hours"))
        ) {
            this.invalidDateClicked("Appointment must be made at least 1 hour in advance.");
            return;
        }

        if (
            // Doctor is on vacation
            this.doctor.vacations!.some(
                ({ start_date, end_date }) =>
                    moment(date).isSameOrAfter(moment(start_date).startOf("day")) &&
                    moment(date).isSameOrBefore(moment(end_date).endOf("day"))
            )
        ) {
            this.invalidDateClicked("Doctor is on vacation at that time.");
            return;
        }

        const thisDayAppointments = this.doctor.appointments
            ?.filter(({ datetime }) => moment(datetime).isSame(date, "day"))
            .sort((a, b) => moment(a.datetime).diff(moment(b.datetime)));

        const { examination } = this.appointmentModel;

        const new_end = this.appointmentEnd({
            datetime: date,
            examination,
        });

        const first_before = thisDayAppointments
            ?.filter(({ datetime }) => moment(datetime).isSameOrBefore(date))
            .at(-1);
        const first_after = thisDayAppointments?.find(({ datetime }) =>
            moment(datetime).isAfter(date)
        );
        let valid = false;
        if (!first_before && !first_after) {
            valid = true;
        }
        if (first_before && first_after) {
            const first_before_end = this.appointmentEnd(first_before);
            valid =
                moment(first_before_end).isSameOrBefore(date) &&
                moment(first_after.datetime).isSameOrAfter(new_end);
            const diff = moment(first_after?.datetime).diff(moment(first_before_end), "minutes");
            if (!valid && diff >= examination.duration) {
                valid = true;
                date = moment(first_before_end).toDate();
            }
        }

        if (first_before && !first_after) {
            const first_before_end = this.appointmentEnd(first_before);
            valid = moment(first_before_end).isSameOrBefore(date);
            if (!valid) {
                valid = true;
                date = moment(first_before_end).toDate();
            }
        }
        if (!first_before && first_after) {
            valid = moment(first_after.datetime).isSameOrAfter(new_end);
            if (!valid) {
                valid = true;
                date = moment(first_after.datetime).add(-examination.duration, "minutes").toDate();
            }
        }

        if (!valid) {
            this.invalidDateClicked("Doctor is not available at that time.");
            return;
        }
        this.calendar?.getApi().getEventById("new")?.remove();
        this.calendar?.getApi().addEvent({
            title: "You",
            id: "new",
            start: date,
            end: moment(date).add(examination.duration, "minutes").toDate(),
            allDay: false,
        });
        const dialogRef = this.dialogService.open(EditAppointmentTimeComponent, {
            header: "New Appointment",
            modal: true,
            draggable: true,
            resizable: false,
            keepInViewport: true,
            width: "fit-content",
            contentStyle: {
                overflow: "auto",
                backgroundColor: "var(--bg-color)",
            },
            data: {
                datetime: date,
                allowedInterval: [
                    first_before ? this.appointmentEnd(first_before).toDate() : null,
                    first_after?.datetime
                        ? moment(first_after?.datetime)
                              .add(-examination.duration, "minutes")
                              .toDate()
                        : null,
                ],
                calendar: this.calendar,
                examination: this.appointmentModel.examination,
            },
        });
        const subscription = dialogRef.onClose.subscribe((event) => {
            if (!event) {
                this.calendar?.getApi().getEventById("new")?.remove();
                return;
            }
            this.appointmentModel = {
                ...this.appointmentModel,
                date: moment(event).startOf("day").toDate(),
                time: event,
            };
            this.attemptAppointment();
            subscription.unsubscribe();
        });
    }

    invalidDateClicked(message: string) {
        this._snackBar.open(message, "OK", {
            duration: 2000,
        });
    }

    ngOnInit(): void {}
}
