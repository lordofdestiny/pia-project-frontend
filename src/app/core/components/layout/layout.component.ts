import { Input, Component } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { IsHandsetService } from '@core/services/is-handset.service';

export interface NavItem {
    title: string;
    route: string;
    rlaOptions: { exact: boolean };
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
    is_logged_in$ = this.authService.logged_in;
    isHandset$ = this.isHandsetService.isHandset$;
    navItems: NavItems = {
        auth: [
            {
                route: '/change-password',
                title: 'Change Password',
                rlaOptions: { exact: false },
            },
            {
                route: '/logout',
                title: 'Log out',
                rlaOptions: { exact: false },
            },
        ],
        no_auth: [
            { route: '', title: 'Home', rlaOptions: { exact: true } },
            { route: '/login', title: 'Log In', rlaOptions: { exact: false } },
            {
                route: '/register',
                title: 'Register',
                rlaOptions: { exact: false },
            },
        ],
    };

    constructor(
        private isHandsetService: IsHandsetService,
        private authService: AuthService
    ) {}
}
