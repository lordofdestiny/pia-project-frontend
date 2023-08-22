import { Component, ViewEncapsulation } from '@angular/core';
import { NavItemData } from '@core/components/main-nav/main-nav.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
    title: string = 'HouseMedica';
    navItems: NavItemData[] = [
        { route: '/login', title: 'Log In' },
        { route: '/register', title: 'Register' },
    ];

    onNgInit() {}
}
