import { animate, keyframes, style, transition, trigger } from "@angular/animations";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { ActivatedRoute, Router } from "@angular/router";
import { Examination } from "@core/models/specialization";
import { Doctor } from "@core/models/users";
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
    username: string = this.route.snapshot.params["username"];
    doctor: Doctor = this.route.snapshot.data["doctor"];

    minTime = new Date();
    maxTime = new Date();
    initialDate = new Date();
    initialTime = new Date();
    bsConfig?: Partial<BsDatepickerConfig>;

    constructor(private route: ActivatedRoute, protected router: Router) {
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
    ngOnInit(): void {}
}
