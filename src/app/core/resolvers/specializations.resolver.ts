import { Injectable } from '@angular/core';
import {
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
} from '@angular/router';
import { Specialization } from '@core/models/specialization';
import { AuthService } from '@core/services/auth.service';
import { SpecializationService } from '@core/services/specialization.service';
import { Observable } from 'rxjs';

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
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot
    ): Observable<Specialization[] | undefined> {
        return this.specializationService.get_all();
    }
}
