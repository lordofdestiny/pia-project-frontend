import { Injectable } from '@angular/core';
import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    CanActivate,
    CanLoad,
    CanMatch,
    Route,
    Router,
    RouterStateSnapshot,
    UrlSegment,
} from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Injectable()
export class RoleGuard implements CanActivate, CanLoad {
    // here you can inject your auth service to check that user is signed in or not
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const allowedRole = route.data['expectedRole'];
        if (this.authService.user_role === allowedRole) {
            return true;
        }
        this.router.navigate([this.authService.user_role]);
        return false;
    }
    canLoad(route: Route): boolean {
        console.log(route.data);
        const allowedRole = route.data?.['expectedRole'];
        if (
            this.authService.logged_in &&
            this.authService.user_role === allowedRole
        ) {
            return true;
        }
        this.router.navigate([this.authService.user_role]);
        return false;
    }
}
