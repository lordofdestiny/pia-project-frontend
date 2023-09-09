import { Injectable } from "@angular/core";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { Promotion } from "@core/models/promotions";
import { PromotionsService } from "@core/services/promotions.service";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class PromotionsResolver implements Resolve<Promotion[]> {
    constructor(private promotionsService: PromotionsService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Promotion[]> {
        return this.promotionsService.get_all_promotions();
    }
}
