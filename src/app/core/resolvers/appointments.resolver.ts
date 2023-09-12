import { Injectable } from "@angular/core";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { AppointmentBase } from "@core/models/appointment";
import { AppointmentsService } from "@core/services/appointments.service";
import { AuthService } from "@core/services/auth.service";
import { Observable, of, tap } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class AppointmentsResolver implements Resolve<AppointmentBase<any>[]> {
    constructor(
        private authService: AuthService,
        private appointmentsService: AppointmentsService
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<AppointmentBase<any>[]> {
        switch (this.authService.user.type) {
            case "patient":
                return this.appointmentsService.getPatientAppointments();
            case "doctor":
                return this.appointmentsService.getDoctorAppointments();
            default:
                return of([]);
        }
    }
}
