import { Component, OnInit } from "@angular/core";
import {
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
    MomentDateAdapter,
} from "@angular/material-moment-adapter";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
    ShowOnDirtyErrorStateMatcher,
} from "@angular/material/core";

import { ConfirmationService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

import moment from "moment";

import { MY_FORMATS } from "src/app/app.module";
import { AppointmentDoctor, AppointmentReport } from "@core/models/appointment";

@Component({
    selector: "app-add-report-popup",
    templateUrl: "./add-report-popup.component.html",
    styleUrls: ["./add-report-popup.component.css"],
    providers: [
        ConfirmationService,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class AddReportPopupComponent implements OnInit {
    appointment: AppointmentDoctor = this.dialogConfig.data["appointment"];

    constructor(
        public dialogRef: DynamicDialogRef,
        public dialogConfig: DynamicDialogConfig,
        private confirmationService: ConfirmationService
    ) {}

    matcher = new ShowOnDirtyErrorStateMatcher();

    minDate = moment().add(1, "days").startOf("day").toDate();
    report: AppointmentReport & { followup: Date } = {
        reason: "",
        diagnosis: "",
        therapy: "",
        followup: this.minDate,
    };

    handleAddReport() {
        this.dialogRef.close({
            report: this.report,
            action: "confirm",
        });
    }

    ngOnInit(): void {}
}
