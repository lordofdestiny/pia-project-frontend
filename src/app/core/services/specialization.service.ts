import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Specialization } from '@core/models/specialization';
import { baseUri } from '@environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SpecializationService {
    constructor(private http: HttpClient) {}

    public get_all(): Observable<Specialization[]> {
        return this.http.get<Specialization[]>(`${baseUri}/specialization/all`);
    }
}
