import { Component, OnInit } from "@angular/core";
import { ShowOnDirtyErrorStateMatcher } from "@angular/material/core";
import { AppointmentDoctor } from "@core/models/appointment";
import { ConfirmationService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
    selector: "app-calendar-event-popup",
    templateUrl: "./calendar-event-popup.component.html",
    styleUrls: ["./calendar-event-popup.component.css"],
    providers: [ConfirmationService],
})
export class CalendarEventPopupComponent implements OnInit {
    appointment: AppointmentDoctor = this.dialogConfig.data["appointment"];
    constructor(
        public dialogRef: DynamicDialogRef,
        public dialogConfig: DynamicDialogConfig,
        private confirmationService: ConfirmationService
    ) {}

    cancellationReason: string = "";
    matcher = new ShowOnDirtyErrorStateMatcher();

    handleSeeAll() {
        this.dialogRef.close({
            action: "seeAll",
            data: this.appointment.patient,
        });
    }

    handleCancel() {
        this.dialogRef.close({
            action: "cancel",
            data: {
                appointment: this.appointment.id,
                reason: this.cancellationReason,
            },
        });
    }

    ngOnInit(): void {}
}
