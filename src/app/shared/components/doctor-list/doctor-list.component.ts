import { Component, OnInit } from '@angular/core';
import { DoctorListData } from '@core/models/doctor';
import { AuthService } from '@core/services/auth.service';
import { DoctorsService } from '@core/services/doctors.service';

/**PRIME NG TEST */
import { Observable, tap } from 'rxjs';

@Component({
    selector: 'app-doctor-list',
    templateUrl: './doctor-list.component.html',
    styleUrls: ['./doctor-list.component.css'],
})
export class DoctorListComponent implements OnInit {
    doctors: Observable<DoctorListData>;
    logged_in: Observable<boolean>;
    loading: boolean = true;
    constructor(
        private doctorService: DoctorsService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.doctors = this.doctorService
            .getAll()
            .pipe(tap(() => (this.loading = false)));
        this.logged_in = this.authService.logged_in;
    }
}
