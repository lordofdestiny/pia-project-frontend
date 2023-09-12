import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppointmentBase, AppointmentPatient, NewAppointment } from "@core/models/appointment";
import { baseUri } from "@environments/environment";
import { Observable, map } from "rxjs";
import { AuthService } from "./auth.service";

type UnresolvedDateAppoinment = Omit<AppointmentBase<any>, "datetime"> & {
    datetime: string;
};

const resolveDates = (appointment: UnresolvedDateAppoinment) =>
    ({
        ...appointment,
        report: appointment.report
            ? {
                  ...appointment.report,
                  followup: new Date(appointment.report?.followup as string),
              }
            : null,
        datetime: new Date(appointment.datetime),
    } as AppointmentPatient);

@Injectable({
    providedIn: "root",
})
export class AppointmentsService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    getPatientAppointments(): Observable<AppointmentPatient[]> {
        const { id } = this.authService.user;
        return this.http
            .get<UnresolvedDateAppoinment[]>(`${baseUri}/appointments/patient/${id}`)
            .pipe(map((appointments) => appointments.map(resolveDates)));
    }

    getDoctorAppointments(): Observable<AppointmentPatient[]> {
        const { id } = this.authService.user;
        return this.http
            .get<UnresolvedDateAppoinment[]>(`${baseUri}/appointments/doctor/${id}`)
            .pipe(map((appointments) => appointments.map(resolveDates)));
    }

    attemptAppointment(appointment: NewAppointment): Observable<AppointmentPatient> {
        return this.http
            .post<UnresolvedDateAppoinment>(`${baseUri}/appointments`, {
                ...appointment,
                datetime: appointment.datetime.toISOString(),
            })
            .pipe(map(resolveDates));
    }

    patientCancelAppointment(appointmentId: string): Observable<void> {
        return this.http.delete<void>(`${baseUri}/appointments/${appointmentId}/patient`);
    }

    requestFullPdfReport(appointmentId: string): Observable<any> {
        return this.http.get(`${baseUri}/appointments/patient/${this.authService.user.id}/report`, {
            observe: "response",
            responseType: "text",
        });
    }

    requestPdfReport(appointmentId: string): Observable<any> {
        return this.http.get(
            `${baseUri}/appointments/patient/${this.authService.user.id}/${appointmentId}/report`,
            {
                observe: "response",
                responseType: "text",
            }
        );
    }
}
