import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-patient-profile',
    host: { class: 'container' },
    template: `<div class="container">
        <app-editable-profile renderFor="patient"></app-editable-profile>
    </div>`,
})
export class PatientProfileComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
