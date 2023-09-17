import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppointmentBase, AppointmentDoctor, AppointmentPatient } from "@core/models/appointment";
import { Patient } from "@core/models/users";
import { AppointmentsService } from "@core/services/appointments.service";

@Component({
    selector: "app-patient-past-appointments",
    templateUrl: "./patient-past-appointments.component.html",
    styleUrls: ["./patient-past-appointments.component.css"],
})
export class PatientPastAppointmentsComponent implements OnInit {
    patient?: Pick<
        Patient,
        "id" | "username" | "first_name" | "last_name" | "email" | "appointments"
    >;
    loading = true;
    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private appointmentService: AppointmentsService
    ) {
        const id = this.route.snapshot.paramMap.get("id");

        if (id) {
            this.appointmentService.getPastAllAppointments(id).subscribe({
                next: this.handlePatientAllAppointments.bind(this),
                error: (err) => {
                    this.router.navigate(["/not-found"]);
                },
            });
        }
    }

    handlePatientAllAppointments(patient: Partial<Patient>) {
        this.patient = patient as any;
        if (this.patient?.appointments) {
            this.patient.appointments = this.patient.appointments.filter(({ report }) => report);
        }
        setTimeout(() => {
            this.loading = false;
        }, 500);
    }

    dscDateSort(a: AppointmentBase<any>, b: AppointmentBase<any>) {
        return b.datetime.getTime() - a.datetime.getTime();
    }

    get appointments() {
        return this.patient?.appointments as AppointmentPatient[];
    }

    ngOnInit(): void {}
}
