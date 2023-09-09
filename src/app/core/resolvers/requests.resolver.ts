import { Injectable } from '@angular/core';
import {
    Router,
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
} from '@angular/router';
import { Examination, ExaminationRequest } from '@core/models/specialization';
import { SpecializationService } from '@core/services/specialization.service';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ExaminationRequestsResolver implements Resolve<Examination[]> {
    constructor(private specializationService: SpecializationService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<ExaminationRequest[]> {
        return this.specializationService.get_requests();
    }
}
