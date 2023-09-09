import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';

import { ActionResultDialogComponent } from '@shared/components/action-success-dialog/action-success-dialog.component';
import { ErrorMessage } from '@shared/components/mat-err-msgs/mat-err-msgs.component';
import { Specialization } from '@core/models/specialization';
import { SpecializationService } from '@core/services/specialization.service';

@Component({
    selector: 'app-request-examination[specialization]',
    templateUrl: './request-examination.component.html',
    styleUrls: ['./request-examination.component.css'],
})
export class RequestExaminationComponent implements OnInit {
    specializationId?: string;
    @Input() set specialization(value: Specialization) {
        this.specializationId = value.id;
    }

    matcher = new ShowOnDirtyErrorStateMatcher();
    requestForm = this.fb.nonNullable.group({
        name: ['', Validators.required],
        duration: [30, Validators.pattern(/^\d+$/), []],
        price: [
            null as unknown as number,
            [
                Validators.required,
                Validators.min(0),
                Validators.max(50000),
                Validators.pattern(/^\d+$/),
            ],
        ],
    });

    durationErrors: ErrorMessage[] = [
        {
            name: 'pattern',
            message: 'Duration must be a number',
        },
    ];
    priceErrors: ErrorMessage[] = [
        {
            name: 'required',
            message: 'Price is required',
        },
        {
            name: 'pattern',
            message: 'Price must be a number',
        },
        {
            name: 'min',
            message: 'Price must be greater than 0',
        },
        {
            name: 'max',
            message: 'Price must be less than 50 000',
        },
    ];
    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private specializationService: SpecializationService
    ) {}

    @ViewChild(FormGroupDirective) private formDirective!: FormGroupDirective;
    async requestExamination() {
        if (this.specializationId === undefined) {
            throw new Error('Specialization id is undefined');
        }
        const { name, duration, price } = this.requestForm.value as Required<{
            name: string;
            duration: number;
            price: number;
        }>;
        try {
            const source$ = this.specializationService.request_examination(
                this.specializationId,
                {
                    name,
                    duration,
                    price,
                    status: 'requested',
                }
            );
            await lastValueFrom(source$);

            this.dialog.open(ActionResultDialogComponent, {
                panelClass: 'dialog-color',
                data: {
                    success: true,
                    message: 'Examination requested successfully',
                },
            });
            this.formDirective.resetForm({
                duration: 30,
            });
        } catch (error) {
            this.dialog.open(ActionResultDialogComponent, {
                panelClass: 'dialog-color',
                data: {
                    success: false,
                    message: 'Error requesting examination',
                },
            });
        }
    }

    ngOnInit(): void {}
}
