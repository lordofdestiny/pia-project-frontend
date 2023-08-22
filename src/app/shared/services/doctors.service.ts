import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { DoctorListData, DoctorListDataItem } from '@models/doctor.model';

import { baseServerUrl } from '@core/constants/url';

@Injectable({
    providedIn: 'any',
})
export class DoctorsService {
    constructor(private http: HttpClient) {}

    getAll(): Observable<DoctorListData> {
        return this.http
            .get<DoctorListData>(`${baseServerUrl}/doctor`)
            .pipe(tap(resolveProfilePictures));
    }
}

function resolveProfilePicture(doctor: DoctorListDataItem): void {
    const { first_name, last_name, profile_picture } = doctor;
    doctor.profile_picture = `${baseServerUrl}${profile_picture}`;
}

function resolveProfilePictures(doctors: DoctorListData): void {
    doctors.forEach((doctor) => {
        resolveProfilePicture(doctor);
    });
}
