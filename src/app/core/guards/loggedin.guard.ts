import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { map, tap } from 'rxjs';

@Injectable()
export class LoggedInGurad implements CanActivate {
    // here you can inject your auth service to check that user is signed in or not
    constructor(private authService: AuthService, private router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.logged_in.pipe(
            tap((x) => console.log('Logged in: ', x)),
            map((x) => {
                if (x) {
                    return false;
                }
                return true;
            })
        );
    }
}
