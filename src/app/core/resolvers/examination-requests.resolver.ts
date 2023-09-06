import { Injectable } from '@angular/core';
import {
    Router,
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
} from '@angular/router';
import { Examination, Specialization } from '@core/models/specialization';
import { Doctor } from '@core/models/users';
import { DoctorsService } from '@core/services/doctors.service';
import { Observable, map } from 'rxjs';

export interface ExaminationRequest {
    doctor: Pick<Doctor, 'id' | 'first_name' | 'last_name'>;
    examination: Examination;
    specialization: Pick<Specialization, 'id' | 'name'>;
}

@Injectable({
    providedIn: 'root',
})
export class ExaminationRequestsResolver
    implements Resolve<ExaminationRequest[]>
{
    constructor(private doctorsService: DoctorsService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<ExaminationRequest[]> {
        return this.doctorsService.get_all().pipe(map(this.processData));
    }

    processData(doctors: Doctor[]): ExaminationRequest[] {
        return doctors
            .map(
                ({
                    id: doctorId,
                    first_name,
                    last_name,
                    examination_requests = [],
                    specialization: { id, name },
                }: Doctor) =>
                    examination_requests.map((examination) => ({
                        doctor: {
                            id: doctorId,
                            first_name,
                            last_name,
                        },
                        examination: {
                            ...examination,
                            _id: undefined,
                        },
                        specialization: {
                            id,
                            name,
                        },
                    }))
            )
            .flatMap((requests) => requests);
    }
}
