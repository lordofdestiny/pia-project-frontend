import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { animate, keyframes, style, transition, trigger } from "@angular/animations";

import { MatDialog } from "@angular/material/dialog";

import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";

import { Doctor } from "@core/models/users";
import { Examination } from "@core/models/specialization";
import { AppointmentPatient } from "@core/models/appointment";
import { AuthService } from "@core/services/auth.service";
import { AppointmentsService } from "@core/services/appointments.service";
import { ActionResultDialogComponent } from "@shared/components/action-success-dialog/action-success-dialog.component";
import { moment } from "@core/utils/moment";

@Component({
    selector: "app-doctor-patient-view",
    templateUrl: "./doctor-patient-view.component.html",
    styleUrls: ["./doctor-patient-view.component.css"],
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

    minTime = new Date();
    maxTime = new Date();
    initialDate = new Date();
    initialTime = new Date();
    bsConfig?: Partial<BsDatepickerConfig>;

    constructor(
        private route: ActivatedRoute,
        protected router: Router,
        private dialog: MatDialog,
        private authService: AuthService,
        private appointmentsService: AppointmentsService
    ) {
        this.minTime.setHours(7);
        this.minTime.setMinutes(0);
        this.maxTime.setHours(23);
        this.maxTime.setMinutes(0);
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
            this.initialDate = moment(this.initialDate).add(1, "days").toDate();
        }
        this.bsConfig = {
            containerClass: "theme-default",
            dateInputFormat: "DD-MM-YYYY",
            minDate: new Date(),
        };
    }

    @ViewChild("makeAppointment") makeAppointment?: ElementRef<HTMLElement>;
    handleSelectedExamination(examination: Examination) {
        this.appointmentModel = { ...this.appointmentModel, examination };
        setTimeout(() => {
            this.makeAppointment?.nativeElement.scrollIntoView({ behavior: "smooth" });
        });
    }

    appointmentModel: {
        examination: Examination | null;
        date: Date;
        time: Date;
    } = {
        examination: null,
        date: this.initialDate,
        time: this.initialTime,
    };

    attemptAppointment(appointmentForm: NgForm) {
        const { examination, date, time } = appointmentForm?.value;
        const datetime = moment(date)
            .set({
                hour: time.getHours(),
                minute: time.getMinutes(),
                second: 0,
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
                next: this.handleAttemptedAppointmentSuccess.bind(this, appointmentForm),
                error: this.handleAttemptedAppointmentError.bind(this),
            });
    }

    handleAttemptedAppointmentSuccess(form: NgForm, appointment: AppointmentPatient) {
        form.resetForm({
            examination: null,
            date: this.initialDate,
            time: this.initialTime,
        });

        this.dialog.open(ActionResultDialogComponent, {
            panelClass: "dialog-color",
            data: {
                success: true,
                message: "Appointment made successfully",
            },
        });
    }
    handleAttemptedAppointmentError(error: any) {
        this.dialog.open(ActionResultDialogComponent, {
            panelClass: "dialog-color",
            data: {
                success: false,
                message: "Appointment could not be made.\n Doctor is not available at that time.",
            },
        });
    }

    ngOnInit(): void {}
}
