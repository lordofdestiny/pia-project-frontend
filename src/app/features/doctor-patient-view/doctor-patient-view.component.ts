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

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {}
}
