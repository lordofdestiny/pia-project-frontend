import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '@core/services/auth.service';

@Component({
    selector: 'app-patient',
    templateUrl: './patient.component.html',
    styleUrls: ['./patient.component.css'],
})
export class PatientComponent implements OnInit {
    baseRoute = '/patient';
    navLinks = [
        { location: 'profile', label: 'Profile', icon: 'account_circle' },
        { location: 'shared', label: 'Overview', icon: 'account_circle' },
        { location: 'shared/sub', label: 'Experience', icon: 'work' },
    ];

    constructor(private titleService: Title, private authService: AuthService) {
        titleService.setTitle(`Patient - ${authService.full_name}`);
    }

    ngOnInit(): void {}
}
