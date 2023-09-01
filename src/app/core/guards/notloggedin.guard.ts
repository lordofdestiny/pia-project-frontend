import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { forkJoin, map, of, tap } from 'rxjs';

@Injectable()
export class NotLoggedInGurad implements CanActivate {
    // here you can inject your auth service to check that user is signed in or not
    constructor(private authService: AuthService, private router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.logged_in.pipe(
            map((x) => {
                if (x) {
                    this.router.navigate([this.authService.user$.value.type]);
                    return false;
                }
                return true;
            })
        );
    }
}
