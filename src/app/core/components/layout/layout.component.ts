import { Input, Component } from '@angular/core';
import { IsActiveMatchOptions } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { IsHandsetService } from '@core/services/is-handset.service';

export interface NavItem {
    title: string;
    route: string | (() => string);
    rlaOptions?: IsActiveMatchOptions | { exact: boolean };
}

export interface NavItems {
    auth: NavItem[];
    no_auth: NavItem[];
}

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
    @Input() title: string = 'Angular Material';

    navItems: NavItems = {
        auth: [
            {
                route: () => this.authService.user_role,
                title: 'Dashboard',
                rlaOptions: {
                    paths: 'subset',
                    fragment: 'ignored',
                    matrixParams: 'ignored',
                    queryParams: 'ignored',
                },
            },
            {
                route: '/edit-password',
                title: 'Edit Password',
            },
            {
                route: '/logout',
                title: 'Log out',
            },
        ],
        no_auth: [
            { route: '', title: 'Home' },
            { route: '/login', title: 'Log In' },
            {
                route: '/register',
                title: 'Register',
            },
        ],
    };

    getRoute(navItems: NavItem): string {
        return typeof navItems.route === 'function'
            ? navItems.route()
            : navItems.route;
    }

    is_logged_in$ = this.authService.logged_in;
    isHandset$ = this.isHandsetService.isHandset$;

    constructor(
        private isHandsetService: IsHandsetService,
        protected authService: AuthService
    ) {}
}
