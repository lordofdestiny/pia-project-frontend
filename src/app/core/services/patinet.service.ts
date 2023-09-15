import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";

import { baseUri } from "@environments/environment";
import { Patient } from "@core/models/users";
import { resolveProfilePictures } from "@core/utils/resolveProfilePicture";
import { AuthService } from "./auth.service";
import { Notification } from "@core/models/notifications";

@Injectable({
    providedIn: "root",
})
export class PatinetService {
    constructor(private http: HttpClient) {}
    register(user: FormData) {
        return this.http
            .post<Patient>(`${baseUri}/patients`, user, {
                headers: new HttpHeaders({ enctype: "multipart/form-data" }),
            })
            .pipe(catchError(AuthService.handleError));
    }

    get_all() {
        return this.http.get<Patient[]>(`${baseUri}/patients`).pipe(tap(resolveProfilePictures));
    }

    markAsSeen(id: string) {
        return this.http.put<Notification[]>(`${baseUri}/patients/${id}/notifications`, {});
        // .pipe(catchError(AuthService.handleError));
    }
}
