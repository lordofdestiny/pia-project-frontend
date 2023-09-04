import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '@core/services/auth.service';

@Component({
    selector: 'app-doctor',
    templateUrl: './doctor.component.html',
    styleUrls: ['./doctor.component.css'],
})
export class DoctorComponent implements OnInit {
    baseRoute = '/doctor';
    navLinks = [
        { location: 'profile', label: 'Profile', icon: 'account_circle' },
    ];

    constructor(private titleService: Title, private authService: AuthService) {
        titleService.setTitle(`Doctor - ${authService.full_name}`);
    }

    ngOnInit(): void {}
}
