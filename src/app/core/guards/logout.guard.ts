import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { tap } from 'rxjs';

@Injectable()
export class LogoutGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}

    canActivate() {
        return this.authService.logout().pipe(
            tap((_) => {
                this.router.navigate(['/']);
            })
        );
    }
}
