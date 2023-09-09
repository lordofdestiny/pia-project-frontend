import { Injectable } from '@angular/core';
import {
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
} from '@angular/router';
import { Doctor } from '@core/models/users';
import { DoctorService } from '@core/services/doctor.service';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DoctorsResolver implements Resolve<Doctor[]> {
    constructor(private doctorService: DoctorService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Doctor[]> {
        return this.doctorService.get_all();
    }
}
