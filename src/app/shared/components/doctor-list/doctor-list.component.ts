import { Component, OnInit, ViewChild } from '@angular/core';
import { DoctorListData, DoctorListDataItem } from '@core/models/doctor.model';

/**PRIME NG TEST */
import { Table } from 'primeng/table';
import { DoctorsService } from 'src/app/shared/services/doctors.service';

@Component({
    selector: 'app-doctor-list',
    templateUrl: './doctor-list.component.html',
    styleUrls: ['./doctor-list.component.css'],
})
export class DoctorListComponent implements OnInit {
    doctors: DoctorListData = [];
    @ViewChild('dt') dt: Table | undefined;
    loading: boolean = true;

    constructor(private doctorService: DoctorsService) {}

    ngOnInit() {
        this.doctorService.getAll().subscribe((doctors) => {
            this.doctors = doctors;
            this.loading = false;
        });
    }
}
