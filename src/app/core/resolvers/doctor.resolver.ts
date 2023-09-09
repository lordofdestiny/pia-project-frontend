import { Injectable } from '@angular/core';
import {
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
    ActivatedRoute,
    Router,
} from '@angular/router';
import { Doctor } from '@core/models/users';
import { DoctorService } from '@core/services/doctor.service';
import { Observable, catchError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DoctorResolver implements Resolve<Doctor> {
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private doctorsService: DoctorService
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Doctor> {
        return this.doctorsService.get(route.params['username']).pipe(
            catchError((err, observable) => {
                this.router.navigate(['/not-found']);
                return observable;
            })
        );
    }
}
