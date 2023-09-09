import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import {
    Examination,
    ExaminationRequest,
    NewExamination,
    Specialization,
} from '@core/models/specialization';
import { baseUri } from '@environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SpecializationService {
    constructor(private http: HttpClient) {}

    public get_all(): Observable<Specialization[]> {
        return this.http.get<Specialization[]>(`${baseUri}/specialization`);
    }

    public get(query: {} | { id: string } | { name: string }) {
        return this.http
            .get<Specialization[]>(`${baseUri}/specialization`, {
                params: query,
            })
            .pipe(map((specializations) => specializations[0]));
    }

    public get_requests() {
        return this.http.get<ExaminationRequest[]>(
            `${baseUri}/specialization/requests`
        );
    }

    public create(specialization: Pick<Specialization, 'name'>) {
        return this.http.post<Specialization>(
            `${baseUri}/specialization`,
            specialization
        );
    }

    public add_examination(
        specializationId: string,
        examination: NewExamination
    ) {
        return this.http.post<Examination>(
            `${baseUri}/specialization/examination`,
            {
                specialization: specializationId,
                ...examination,
            }
        );
    }

    public request_examination(
        specializationId: string,
        examination: NewExamination
    ) {
        return this.http.post<Specialization>(
            `${baseUri}/specialization/requests`,
            {
                specialization: specializationId,
                ...examination,
            }
        );
    }

    public answer_request(exaxminationId: string, response: boolean) {
        return this.http.put<Examination>(
            `${baseUri}/specialization/requests`,
            {
                id: exaxminationId,
                status: response,
            }
        );
    }

    public update_examination(examination: Examination) {
        const { id, status: _status, ...payload } = examination;
        return this.http.put<Examination>(
            `${baseUri}/specialization/examination/${id}`,
            payload
        );
    }

    public delete_examination(examinationId: string) {
        return this.http.delete<void>(
            `${baseUri}/specialization/examination/${examinationId}`
        );
    }
}
