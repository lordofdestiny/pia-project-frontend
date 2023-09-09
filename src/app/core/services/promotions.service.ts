import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Promotion } from "@core/models/promotions";

import { moment } from "@core/utils/moment";
import { baseUri } from "@environments/environment";
import { Observable, map } from "rxjs";

export interface PromotionServer {
    id: string;
    message: string;
    start: string;
    end: string;
}

@Injectable({
    providedIn: "root",
})
export class PromotionsService {
    constructor(private http: HttpClient) {}

    get_all_promotions(): Observable<Promotion[]> {
        return this.http.get<PromotionServer[]>(`${baseUri}/managers/promotions`).pipe(
            map((promotions) =>
                promotions.map((promotion) => ({
                    ...promotion,
                    start: moment(promotion.start).toDate(),
                    end: moment(promotion.end).toDate(),
                }))
            )
        );
    }

    add_promotion(promotion: Omit<Promotion, "id">): Observable<Promotion> {
        return this.http
            .post<PromotionServer>(`${baseUri}/managers/promotions`, {
                ...promotion,
                start: promotion.start.toISOString(),
                end: promotion.end.toISOString(),
            })
            .pipe(
                map((promotion) => ({
                    ...promotion,
                    start: moment(promotion.start).toDate(),
                    end: moment(promotion.end).toDate(),
                }))
            );
    }
}
