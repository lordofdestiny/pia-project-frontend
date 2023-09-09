import { Component, OnInit } from '@angular/core';
import { Doctor } from '@core/models/users';
import { AuthService } from '@core/services/auth.service';

@Component({
    selector: 'app-miscellaneous',
    templateUrl: './miscellaneous.component.html',
    styleUrls: ['./miscellaneous.component.css'],
})
export class MiscellaneousComponent implements OnInit {
    doctor = this.authService.user as Doctor;
    constructor(private authService: AuthService) {}

    ngOnInit(): void {}
}
