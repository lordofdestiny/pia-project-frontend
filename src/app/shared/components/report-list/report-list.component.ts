import { Component, ContentChild, Directive, Input, OnInit, TemplateRef } from "@angular/core";
import {
    AppointmentBase,
    AppointmentDoctor,
    AppointmentPatient,
    AppointmentType,
} from "@core/models/appointment";
import moment from "moment";

@Directive({
    selector: "[reportListButtons]",
})
export class ReportListButtonsDirective {
    constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
    selector: "app-report-list",
    templateUrl: "./report-list.component.html",
    styleUrls: ["./report-list.component.css"],
})
export class ReportListComponent implements OnInit {
    constructor() {}
    @Input() noDataMessage: string = "No data available";

    private _type?: AppointmentType;
    @Input() set type(value: AppointmentType) {
        this._type = value;
    }
    get type(): AppointmentType {
        return this._type as AppointmentType;
    }

    private _appointments: AppointmentBase<any>[] = [];
    @Input() set appointments(value: AppointmentBase<any>[]) {
        this._appointments = value.filter(({ report }) => report);

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

    ngOnInit(): void {}

    @ContentChild(ReportListButtonsDirective)
    buttons!: ReportListButtonsDirective;
}
