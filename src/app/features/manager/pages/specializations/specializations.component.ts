import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { DoctorService } from '@core/services/doctor.service';
import {
    ExaminationRequest,
    Specialization,
} from '@core/models/specialization';
import { SpecializationService } from '@core/services/specialization.service';
import { lastValueFrom } from 'rxjs';
import { ActionResultDialogComponent } from '@shared/components/action-success-dialog/action-success-dialog.component';
import { ExaminationRequestResponse } from '@features/manager/components/examination-requests/examination-requests.component';
import { NgModel } from '@angular/forms';
@Component({
    selector: 'app-specializations',
    templateUrl: './specializations.component.html',
    styleUrls: ['./specializations.component.css'],
})
export class SpecializationsComponent implements OnInit {
    isExpanded = new Map<string, boolean>();

    isExpandedProxy: any = new Proxy(this.isExpanded, {
        get(target: Map<string, boolean>, key: string) {
            if (!target.has(key)) {
                if (target.size === 0) {
                    target.set(key, true);
                } else {
                    target.set(key, false);
                }
            }
            return target.get(key);
        },
        set(target: Map<string, boolean>, key: string, value: boolean) {
            target.set(key, value);
            return true;
        },
    });

    specializations: Specialization[] =
        this.route.snapshot.data['specializations'];
    requests = this.route.snapshot.data['requests'];

    constructor(
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private doctorService: DoctorService,
        private specializationService: SpecializationService
    ) {}

    editing = false;

    async handleExaminationRequestResponse({
        examinationId,
        specializationId,
        action,
    }: ExaminationRequestResponse) {
        this.specializationService
            .answer_request(examinationId, action)
            .subscribe({
                next: (examination) => {
                    this.showResponseDialog({
                        success: true,
                        message: `Examination request successfully ${
                            action ? 'accepted' : 'rejected'
                        }!`,
                    });
                    if (!action) return;
                    const specialization = this.specializations.find(
                        ({ id }) => id === specializationId
                    )!;
                    specialization.examinations = [
                        ...(specialization.examinations ?? []),
                        examination,
                    ];
                },
                error: (_error) =>
                    this.showResponseDialog({
                        success: false,
                        message: `Failed to ${
                            action ? 'accept' : 'reject'
                        } examination request!`,
                    }),
            });
    }

    showResponseDialog(data: { success: boolean; message: string }) {
        this.dialog.open(ActionResultDialogComponent, {
            data,
            panelClass: 'dialog-color',
        });
    }

    @ViewChild('newSpecNameInput') newSpecNameInput?: NgModel;
    newSpecName = '';
    handleCreateSpecialization() {
        const newSpecName = this.newSpecName.trim();
        this.specializationService.create({ name: newSpecName }).subscribe({
            next: this.handleCreateSpecializationSuccess.bind(this),
            error: this.hadnleCreateSpecializationError.bind(this),
            complete: () => this.newSpecNameInput?.reset(),
        });
    }

    handleCreateSpecializationSuccess(specialization: Specialization) {
        this.specializations = [...this.specializations, specialization];
        this.specializations.sort((a, b) => a.name.localeCompare(b.name));
        this.showResponseDialog({
            success: true,
            message: `Specialization "${specialization.name}" successfully created!`,
        });
    }

    hadnleCreateSpecializationError(error: any) {
        this.showResponseDialog({
            success: false,
            message: `Failed to create specialization "${this.newSpecName}"!`,
        });
    }

    ngOnInit(): void {}
}
