import { Component, OnInit } from '@angular/core';
import { Doctor } from '@core/models/users';
import { AuthService } from '@core/services/auth.service';
import { DoctorService } from '@core/services/doctor.service';

/**PRIME NG TEST */
import { Observable, tap } from 'rxjs';

@Component({
    selector: 'app-doctor-list',
    templateUrl: './doctor-list.component.html',
    styleUrls: ['./doctor-list.component.css'],
})
export class DoctorListComponent implements OnInit {
    doctors?: Observable<Doctor[]>;
    logged_in?: Observable<boolean>;
    loading: boolean = true;
    constructor(
        private doctorService: DoctorService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.doctors = this.doctorService
            .get_all()
            .pipe(tap(() => (this.loading = false)));
        this.logged_in = this.authService.logged_in;
    }
}
