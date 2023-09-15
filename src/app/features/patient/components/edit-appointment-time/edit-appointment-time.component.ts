import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Examination } from "@core/models/specialization";
import { FullCalendarComponent } from "@fullcalendar/angular";
import moment from "moment";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
    selector: "app-edit-appointment-time",
    templateUrl: "./edit-appointment-time.component.html",
    styleUrls: ["./edit-appointment-time.component.css"],
})
export class EditAppointmentTimeComponent implements OnInit {
    calendar: FullCalendarComponent = this.config.data.calendar;
    datetime: Date = this.config.data.datetime;
    exam: Examination = this.config.data.examination;
    minTime: Date;
    maxTime: Date;
    constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
        [this.minTime, this.maxTime] = this.config.data.allowedInterval;
        this.minTime ??= moment(this.datetime)
            .set({
                hour: 7,
                minute: 0,
                second: 0,
            })
            .toDate();
        this.maxTime ??= moment(this.datetime)
            .set({
                hour: 23,
                minute: 0,
                second: 0,
            })
            .add(-this.exam.duration, "minutes")
            .toDate();
    }

    ngOnInit(): void {}
    model = {
        time: new Date(this.datetime),
    };

    moveEvent(newTime: Date) {
        const event = this.calendar.getApi().getEventById("new");
        event?.remove();
        this.calendar.getApi().addEvent({
            title: "You",
            id: "new",
            start: moment(newTime).toDate(),
            end: moment(newTime).add(this.exam.duration, "minutes").toDate(),
            allDay: false,
        });
    }

    handleSubmit(form: NgForm) {
        if (form.invalid) return;
        this.ref.close(this.model.time);
    }

    handleCancel() {
        this.ref.close();
    }

    handleTimeChanged(datetime: any) {
        if (!datetime) return;
        this.moveEvent(datetime);
    }
}
