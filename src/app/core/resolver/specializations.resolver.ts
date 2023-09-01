import { Injectable } from '@angular/core';
import {
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
} from '@angular/router';
import { Specialization } from '@core/models/specialization';
import { AuthService } from '@core/services/auth.service';
import { SpecializationService } from '@core/services/specialization.service';
import { Observable, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SpecializationsResolver
    implements Resolve<Specialization[] | undefined>
{
    constructor(
        private authService: AuthService,
        private specializationService: SpecializationService
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Specialization[] | undefined> {
        if (this.authService.user_role === 'doctor') {
            return this.specializationService.get_all().pipe();
        }
        return of(undefined);
    }
}
