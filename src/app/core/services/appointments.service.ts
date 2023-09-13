import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    AppointmentBase,
    AppointmentDoctor,
    AppointmentPatient,
    AppointmentReport,
    NewAppointment,
} from "@core/models/appointment";
import { baseUri } from "@environments/environment";
import { Observable, map, tap } from "rxjs";
import { AuthService } from "./auth.service";
import { Patient } from "@core/models/users";

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
    } as AppointmentBase<any>);

@Injectable({
    providedIn: "root",
})
export class AppointmentsService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    public getPatientAppointments(): Observable<AppointmentPatient[]> {
        const { id } = this.authService.user;
        return this.http
            .get<UnresolvedDateAppoinment[]>(`${baseUri}/appointments/patient/${id}`)
            .pipe(map((appointments) => appointments.map(resolveDates) as AppointmentPatient[]));
    }

    public getDoctorAppointments(): Observable<AppointmentPatient[]> {
        const { id } = this.authService.user;
        return this.http
            .get<UnresolvedDateAppoinment[]>(`${baseUri}/appointments/doctor/${id}`)
            .pipe(map((appointments) => appointments.map(resolveDates) as AppointmentPatient[]));
    }

    public getPastAllAppointments(patinetId: string): Observable<Partial<Patient>> {
        return this.http
            .get<Partial<Patient>>(`${baseUri}/appointments/doctor/patient/${patinetId}`)
            .pipe(
                tap((patient) => {
                    if (patient["appointments"]) {
                        patient["appointments"] = (<UnresolvedDateAppoinment[]>(
                            (patient["appointments"] as unknown)
                        )).map(resolveDates);
                    }
                })
            );
    }

    public attemptAppointment(appointment: NewAppointment): Observable<AppointmentPatient> {
        return this.http
            .post<UnresolvedDateAppoinment>(`${baseUri}/appointments`, {
                ...appointment,
                datetime: appointment.datetime.toISOString(),
            })
            .pipe(map(resolveDates)) as Observable<AppointmentPatient>;
    }

    public patientCancelAppointment(appointmentId: string): Observable<void> {
        return this.http.delete<void>(`${baseUri}/appointments/${appointmentId}/patient`);
    }

    public doctorCancelAppointment(appointmentId: string, reason: string): Observable<void> {
        return this.http.post<void>(`${baseUri}/appointments/${appointmentId}/doctor`, {
            reason,
        });
    }

    public requestFullPdfReport(): Observable<any> {
        return this.http.get(`${baseUri}/appointments/patient/${this.authService.user.id}/report`, {
            observe: "response",
            responseType: "text",
        });
    }

    public requestPdfReport(appointmentId: string): Observable<any> {
        return this.http.get(
            `${baseUri}/appointments/patient/${this.authService.user.id}/${appointmentId}/report`,
            {
                observe: "response",
                responseType: "text",
            }
        );
    }

    public doctorPublishReport(
        appointmentId: string,
        report: AppointmentReport
    ): Observable<AppointmentDoctor> {
        return this.http
            .post<UnresolvedDateAppoinment>(
                `${baseUri}/appointments/${appointmentId}/report`,
                report
            )
            .pipe(map(resolveDates)) as Observable<AppointmentDoctor>;
    }
}
