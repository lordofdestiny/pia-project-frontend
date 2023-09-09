import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { baseUri } from '@environments/environment';
import { Doctor } from '@core/models/users';
import {
    resolveProfilePicture,
    resolveProfilePictures,
} from '@core/utils/resolveProfilePicture';
import { AuthService } from './auth.service';
import { moment } from '@core/utils/moment';
import { Examination } from '@core/models/specialization';

@Injectable({
    providedIn: 'any',
})
export class DoctorService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    public register(doctor: FormData): Observable<Doctor> {
        return this.http
            .post<Doctor>(`${baseUri}/doctors`, doctor, {
                headers: new HttpHeaders({ enctype: 'multipart/form-data' }),
            })
            .pipe(tap(resolveProfilePicture));
    }

    public get_all(): Observable<Doctor[]> {
        return this.http
            .get<Doctor[]>(`${baseUri}/doctors`)
            .pipe(tap(resolveProfilePictures));
    }

    public get(username: string): Observable<Doctor> {
        return this.http
            .get<Doctor[]>(`${baseUri}/doctors`, {
                params: { username },
            })
            .pipe(
                map((doctors) => doctors[0]),
                tap(resolveProfilePicture)
            );
    }

    public update_examinations(doctorId: string, examinationIds: string[]) {
        return this.http
            .put<{ examinations: Examination[] }>(
                `${baseUri}/doctors/${doctorId}/examinations`,
                {
                    examinationIds,
                }
            )
            .pipe(
                tap(
                    ({ examinations }) =>
                        (this.authService.user.examinations = examinations)
                )
            );
    }

    public add_vacation(
        doctorId: string,
        vacation: { start_date: Date; end_date: Date }
    ) {
        return this.http
            .put<{
                message: string;
                vacations: { start_date: string; end_date: string }[];
            }>(`${baseUri}/doctors/${doctorId}/vacations`, {
                start_date: moment(vacation.start_date).startOf('day').toJSON(),
                end_date: moment(vacation.end_date).endOf('day').toJSON(),
            })
            .pipe(
                map(({ vacations }) =>
                    vacations.map(({ start_date, end_date }) => ({
                        start_date: moment(start_date).toDate(),
                        end_date: moment(end_date).toDate(),
                    }))
                ),
                tap(
                    (vacations) => (this.authService.user.vacations = vacations)
                )
            );
    }
}
