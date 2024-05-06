import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, map, tap } from "rxjs";
import { Notification } from "@core/models/notifications";
import { environment } from "@environments/environment";
import { AuthService } from "@core/services/auth.service";

@Injectable({
    providedIn: "root",
})
export class NotificationsResolver implements Resolve<Notification[]> {
    constructor(private http: HttpClient, private authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Notification[]> {
        const patientId = this.authService.user.id;
        return this.http.get<Notification[]>(`${environment.baseUri}/patients/${patientId}/notifications`).pipe(
            tap((notifications) => {
                this.authService.user = {
                    ...this.authService.user,
                    notifications,
                };
            })
        );
    }
}
