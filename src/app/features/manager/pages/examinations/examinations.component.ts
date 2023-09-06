import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { ExaminationRequest } from '@core/resolvers/examination-requests.resolver';
import { DoctorsService } from '@core/services/doctors.service';
import { ActionResultDialogComponent } from '@shared/components/action-success-dialog/action-success-dialog.component';
import { FullNamePipe } from '@shared/pipes/full-name.pipe';
import { tap } from 'rxjs';

@Component({
    selector: 'app-examinations',
    templateUrl: './examinations.component.html',
    styleUrls: ['./examinations.component.css'],
})
export class ExaminationsComponent implements OnInit {
    requests = this.route.snapshot.data['requests'];

    constructor(
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private doctorsService: DoctorsService
    ) {}

    ngOnInit(): void {}

    handleRequest({
        request: { doctor, examination },
        action,
    }: {
        request: ExaminationRequest;
        action: boolean;
    }) {
        const { id: doctorId } = doctor;
        const { id: examinationId } = examination;
        this.doctorsService
            .respond_to_examination_request(doctorId, {
                examinationId,
                action,
            })
            .pipe(tap(console.log))
            .subscribe({
                next: () => {
                    this.requests = this.requests.filter(
                        (request: ExaminationRequest) =>
                            request.examination.id !== examinationId
                    );
                    const { first_name, last_name } = doctor;
                    const full_name = `${first_name} ${last_name}`;
                    this.dialog.open(ActionResultDialogComponent, {
                        data: {
                            success: true,
                            message: this
                                .msgForExamRequest`${full_name}${action}${true}`,
                        },
                    });
                },
                error: (err) => {
                    const { first_name, last_name } = doctor;
                    const full_name = `${first_name} ${last_name}`;
                    this.dialog.open(ActionResultDialogComponent, {
                        data: {
                            success: false,
                            message: this
                                .msgForExamRequest`${full_name}${action}${false}`,
                        },
                    });
                },
            });
    }

    msgForExamRequest(
        _strigns: TemplateStringsArray,
        name: string,
        action: boolean,
        success: boolean
    ) {
        const word = action ? 'approved' : 'rejected';
        if (success) {
            return `Examination ${word} for ${name}`;
        }
        return `Failed to ${word} examination for ${name}`;
    }
}
