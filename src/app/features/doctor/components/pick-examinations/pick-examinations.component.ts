import { Component, Input, OnInit } from '@angular/core';
import { Examination } from '@core/models/specialization';
import { DoctorExaminations } from '@core/resolvers/examinations.resolver';

@Component({
    selector: 'app-pick-examinations',
    templateUrl: './pick-examinations.component.html',
    styleUrls: ['./pick-examinations.component.css'],
})
export class PickExaminationsComponent implements OnInit {
    @Input() examinations?: DoctorExaminations;
    constructor() {}

    ngOnInit(): void {}
}
