import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Notification } from "@core/models/notifications";
import { AuthService } from "@core/services/auth.service";
import { PatinetService } from "@core/services/patinet.service";
import moment from "moment";

@Component({
    selector: "app-notifications",
    templateUrl: "./notifications.component.html",
    styleUrls: ["./notifications.component.css"],
})
export class NotificationsComponent implements OnInit {
    notifications? = (this.route.snapshot.data["notifications"] as Notification[])
        .filter(this.showReminder)
        .sort(
            ({ notification: { date: a } }, { notification: { date: b } }) =>
                moment(b).toDate().getTime() - moment(a).toDate().getTime()
        );
    constructor(
        private route: ActivatedRoute,
        private patientService: PatinetService,
        private authService: AuthService
    ) {}

    showReminder({ notification }: Notification) {
        if (notification["type"].toLowerCase() !== "appointment".toLowerCase()) {
            return true;
        }
        return moment(notification.date).toDate() <= new Date();
    }

    ngOnInit(): void {
        if (this.notifications?.some(({ seen }) => !seen)) {
            this.patientService.markAsSeen(this.authService.user.id).subscribe({
                error: (err) => console.error(err),
            });
        }
    }
}
