import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ExaminationRequest } from '@core/resolvers/examination-requests.resolver';

@Component({
    selector: 'app-examination-requests',
    templateUrl: './examination-requests.component.html',
    styleUrls: ['./examination-requests.component.css'],
})
export class ExaminationRequestsComponent implements OnInit {
    _requests: ExaminationRequest[] = [];
    @Input() set requests(value: ExaminationRequest[]) {
        this._requests = [...value];
        this._requests.sort();
    }
    @Output() request = new EventEmitter<{
        request: ExaminationRequest;
        action: boolean;
    }>();
    headerRows = ['doctor', 'specialization', 'examination', 'actions'];
    constructor() {}

    handle(request: ExaminationRequest, action: boolean) {
        this.request.emit({ request, action });
    }

    ngOnInit(): void {}
}
