import { Component, OnInit, OnDestroy } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Patient } from "@core/models/users";
import { AuthService } from "@core/services/auth.service";
import moment from "moment";
import { Subscription } from "rxjs";

@Component({
    selector: "app-patient",
    templateUrl: "./patient.component.html",
    styleUrls: ["./patient.component.css"],
})
export class PatientComponent implements OnInit, OnDestroy {
    baseRoute = "/patient";
    navLinks = [
        { location: "profile", label: "Profile", icon: "account_circle" },
        { location: "doctors", label: "Doctors", icon: "face " },
        { location: "appointments", label: "Appointments", icon: "healing" },
        {
            location: "notifications",
            label: "Notifications",
            icon: "notifications_none",
        },
    ];
    sub: Subscription = this.authService.user$.subscribe((user) => {
        if (user) {
            const patient = <Patient>user;
            if (
                patient.notifications?.some(
                    ({ seen, notification: { date } }) =>
                        moment(date).isSameOrBefore(moment()) && !seen
                )
            )
                this.navLinks[3].icon = "notifications_active";
            else this.navLinks[3].icon = "notifications_none";
        }
        this.navLinks = [...this.navLinks];
    });
    constructor(private titleService: Title, private authService: AuthService) {
        titleService.setTitle(`Patient - ${authService.full_name}`);
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
