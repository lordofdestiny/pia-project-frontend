import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppointmentPatient, NewAppointment } from "@core/models/appointment";
import { baseUri } from "@environments/environment";

@Injectable({
    providedIn: "root",
})
export class AppointmentsService {
    constructor(private http: HttpClient) {}

    attemptAppointment(appointment: NewAppointment) {
        return this.http.post<AppointmentPatient>(`${baseUri}/appointments`, {
            ...appointment,
            datetime: appointment.datetime.toISOString(),
        });
    }
}
