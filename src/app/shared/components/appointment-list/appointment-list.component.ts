import { Component, ContentChild, Directive, Input, OnInit, TemplateRef } from "@angular/core";
import {
    AppointmentBase,
    AppointmentDoctor,
    AppointmentPatient,
    AppointmentType,
} from "@core/models/appointment";

@Directive({
    selector: "[appointmentListButtons]",
})
export class AppointmentListButtonsDirective {
    constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
    selector: "app-appointment-list[type]",
    templateUrl: "./appointment-list.component.html",
    styleUrls: ["./appointment-list.component.css"],
})
export class AppointmentListComponent implements OnInit {
    constructor() {}
    @Input() noDataMessage: string = "No data available";

    readonly patientHeaderRows = ["examination", "date", "time", "branch", "doctor", "actions"];
    readonly docorHeaderRows = ["patient", "date", "time", "examination", "actions"];
    private _type?: AppointmentType;
    @Input() set type(value: AppointmentType) {
        if (value === "patient") {
            this.headerRows = this.patientHeaderRows;
        } else if (value === "doctor") {
            this.headerRows = this.docorHeaderRows;
        }
        this._type = value;
    }
    get type(): AppointmentType {
        return this._type as AppointmentType;
    }

    private _appointments: AppointmentBase<any>[] = [];
    @Input() set appointments(value: AppointmentBase<any>[]) {
        this._appointments = this._filter ? value.filter(this._filter) : value;
        if (this._sort) {
            this._appointments.sort(this._sort);
        }
    }
    get appointments(): AppointmentBase<any>[] {
        return this._appointments;
    }
    asBase(appointment: AppointmentBase<any>): AppointmentBase<any> {
        return appointment;
    }
    asDoctor(appointment: AppointmentBase<any>): AppointmentDoctor {
        return appointment as AppointmentDoctor;
    }

    asPatient(appointment: AppointmentBase<any>): AppointmentPatient {
        return appointment as AppointmentPatient;
    }

    private _sort?: (a: AppointmentBase<any>, b: AppointmentBase<any>) => number;
    @Input() set sort(value: (a: AppointmentBase<any>, b: AppointmentBase<any>) => number) {
        this._sort = value;
        if (value) {
            this.appointments.sort(value);
        }
    }

    private _filter?: (appointment: AppointmentBase<any>) => boolean;
    @Input() set filter(value: (appointment: AppointmentBase<any>) => boolean) {
        this._filter = value;
        if (value) {
            this.appointments = this.appointments.filter(value);
        }
    }

    ngOnInit(): void {}
    headerRows: string[] = [];

    @ContentChild(AppointmentListButtonsDirective)
    buttons!: AppointmentListButtonsDirective;
}
