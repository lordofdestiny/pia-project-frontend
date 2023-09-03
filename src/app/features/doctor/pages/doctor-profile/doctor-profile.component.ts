import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-patient-profile',
    host: { class: 'container' },
    template: `<div class="container">
        <app-editable-profile renderFor="doctor"></app-editable-profile>
    </div>`,
})
export class DoctorProfileComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
