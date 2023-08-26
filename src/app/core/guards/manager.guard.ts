import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '@services/auth.service';

@Injectable()
export class LoggedInGurad implements CanActivate {
    // here you can inject your auth service to check that user is signed in or not
    constructor(private authService: AuthService, private router: Router) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (this.authService.user_role === 'manager') {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
