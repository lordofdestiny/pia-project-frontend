import {
    Component,
    OnInit,
    OnChanges,
    SimpleChanges,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import { ExaminationRequest } from '@core/models/specialization';

export interface ExaminationRequestResponse {
    examinationId: string;
    specializationId: string;
    action: boolean;
}

@Component({
    selector: 'app-examination-requests',
    templateUrl: './examination-requests.component.html',
    styleUrls: ['./examination-requests.component.css'],
})
export class ExaminationRequestsComponent implements OnInit, OnChanges {
    _requests = [] as ExaminationRequest[];
    @Input() set requests(value: ExaminationRequest[]) {
        this._requests = [...(value ?? [])];
    }
    @Output() requestsChange = new EventEmitter<ExaminationRequest[]>();
    @Output() response = new EventEmitter<ExaminationRequestResponse>();
    headerRows = ['specialization', 'name', 'duration', 'price', 'actions'];
    constructor() {}
    handle(request: ExaminationRequest, action: boolean) {
        const {
            id: examinationId,
            specialization: { id: specializationId },
        } = request;
        this._requests.splice(this._requests.indexOf(request), 1);
        this.response.emit({ examinationId, specializationId, action });
    }

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['requests'].isFirstChange()) {
            this._requests.sort();
        }
    }
}
