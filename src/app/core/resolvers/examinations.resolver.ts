import { Injectable } from '@angular/core';
import {
    Router,
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Examination } from '@core/models/specialization';
import { Doctor } from '@core/models/users';
import { AuthService } from '@core/services/auth.service';
import { ExaminationsService } from '@core/services/examinations.service';

export interface DoctorExaminations {
    requested?: Examination[];
    current?: Examination[];
    forSpecialization?: Examination[];
}

@Injectable({
    providedIn: 'root',
})
export class ExaminationsResolver implements Resolve<DoctorExaminations> {
    constructor(
        private examinationsService: ExaminationsService,
        private authService: AuthService
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<DoctorExaminations> {
        const {
            examinations: current = [],
            examination_requests: requested = [],
            specialization: { id: specializationId },
        } = this.authService.user as Doctor;
        return this.examinationsService
            .forSpecialization(specializationId)
            .pipe(
                map((forSpecialization) => {
                    return {
                        requested,
                        current,
                        forSpecialization,
                    };
                })
            );
    }
}
