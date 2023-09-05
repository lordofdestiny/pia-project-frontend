import { Injectable } from '@angular/core';
import {
    Router,
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
} from '@angular/router';
import { Patient } from '@core/models/users';
import { PatinetService } from '@core/services/patinet.service';
import { Observable, map, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PatientsResolver
    implements Resolve<{ approved: Patient[]; requests: Patient[] }>
{
    constructor(private patientService: PatinetService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<{ approved: Patient[]; requests: Patient[] }> {
        return this.patientService.get_all().pipe(
            map((patients: Patient[]) => {
                return {
                    approved: patients.filter(
                        ({ status }: Patient) => status === 'active'
                    ),
                    requests: patients.filter(
                        ({ status }: Patient) => status === 'created'
                    ),
                };
            })
        );
    }
}
