import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Injectable()
export class RoleGuard implements CanActivate {
    // here you can inject your auth service to check that user is signed in or not
    constructor(private authService: AuthService, private router: Router) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const allowedRole = route.data['expectedRole'];
        if (this.authService.user_role !== allowedRole) {
            this.router.navigate([allowedRole]);
            return false;
        }
        return true;
    }
}
