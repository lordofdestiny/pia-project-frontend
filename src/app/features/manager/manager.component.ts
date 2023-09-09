import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { AuthService } from "@core/services/auth.service";

@Component({
    selector: "app-manager",
    templateUrl: "./manager.component.html",
    styleUrls: ["./manager.component.css"],
})
export class ManagerComponent implements OnInit {
    baseRoute = "/manager";
    navLinks = [
        { location: "profile", label: "Profile", icon: "account_circle" },
        { location: "users", label: "Users", icon: "person" },
        {
            location: "specializations",
            label: "Specializations",
            icon: "medical_services",
        },
        {
            location: "promotions",
            label: "Promotions",
            icon: "flag",
        },
    ];

    constructor(private titleService: Title, private authService: AuthService) {
        titleService.setTitle(`Manager - ${authService.full_name}`);
    }

    ngOnInit(): void {}
}
