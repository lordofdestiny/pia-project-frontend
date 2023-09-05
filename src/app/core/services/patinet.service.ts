import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { baseUri } from '@environments/environment';
import { Patient, User } from '@core/models/users';
import { resolveProfilePictures } from '@core/utils/resolveProfilePicture';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class PatinetService {
    constructor(private http: HttpClient) {}
    register(user: FormData) {
        return this.http
            .post<Patient>(`${baseUri}/patients`, user, {
                headers: new HttpHeaders({ enctype: 'multipart/form-data' }),
            })
            .pipe(catchError(AuthService.handleError));
    }

    get_all() {
        return this.http
            .get<Patient[]>(`${baseUri}/patients`)
            .pipe(tap(resolveProfilePictures));
    }
}
