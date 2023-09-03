import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Doctor } from '@core/models/users';

@Component({
    selector: 'app-doctor-patient-view',
    templateUrl: './doctor-patient-view.component.html',
    styleUrls: ['./doctor-patient-view.component.css'],
})
export class DoctorPatientViewComponent implements OnInit {
    username: string = this.route.snapshot.params['username'];
    doctor: Doctor = this.route.snapshot.data['doctor'];

    constructor(private route: ActivatedRoute) {
        if (this.doctor.specialization instanceof Object) {
            this.doctor.specialization = this.doctor.specialization?.name ?? '';
        }
    }

    durationString(duration: number): string {
        const minutes = duration % 60;
        const hours = Math.floor(duration / 60);
        return `${hours}h ${minutes}m`;
    }

    ngOnInit(): void {}
}
