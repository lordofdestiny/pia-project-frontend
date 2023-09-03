import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-patient-profile',
    host: { class: 'container' },
    template: `<div class="container">
        <app-editable-profile renderFor="manager"></app-editable-profile>
    </div>`,
})
export class ManagerProfileComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
