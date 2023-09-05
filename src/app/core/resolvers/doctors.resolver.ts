import { Injectable } from '@angular/core';
import {
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
} from '@angular/router';
import { Doctor } from '@core/models/users';
import { DoctorsService } from '@core/services/doctors.service';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DoctorsResolver implements Resolve<Doctor[]> {
    constructor(private doctorService: DoctorsService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Doctor[]> {
        return this.doctorService.get_all();
    }
}
