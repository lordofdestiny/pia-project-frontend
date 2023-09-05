import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Examination } from '@core/models/specialization';
import { baseUri } from '@environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ExaminationsService {
    constructor(private http: HttpClient) {}

    forSpecialization(specializationId: string) {
        return this.http.get<Examination[]>(`${baseUri}/examinations`, {
            params: {
                spec: specializationId,
            },
        });
    }
}
