import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Doctor, Patient, User } from '@core/models/users';
import { ProfileService } from '@core/services/profile.service';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { ProfileUpdates } from '@core/utils/profile-update-handlers';
import { PictureEvent } from '@shared/components/editable-profile/editable-profile.component';
import { Specialization } from '@core/models/specialization';
import { FileInput } from 'ngx-material-file-input';
import { DoctorsService } from '@core/services/doctors.service';
import { create } from 'domain';
import { CreateDoctorComponent } from '@features/manager/components/create-doctor/create-doctor.component';

@Component({
    selector: 'app-manage-users',
    templateUrl: './manage-users.component.html',
    styleUrls: ['./manage-users.component.css'],
})
export class ManageUsersComponent implements OnInit, AfterViewInit, OnDestroy {
    patients = this.route.snapshot.data['patients'] as {
        approved: Patient[];
        requests: Patient[];
    };
    doctors = this.route.snapshot.data['doctors'] as Doctor[];
    specializations = this.route.snapshot.data[
        'specializations'
    ] as Specialization[];

    constructor(
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private doctorService: DoctorsService,
        private profileService: ProfileService
    ) {}
    ngOnInit(): void {}

    // ? May not be needed
    panelOpenStates: { [key: string]: boolean } = {
        approved: false,
        requests: this.patients.requests?.length > 0,
        doctors: false,
        'create-doctor': false,
    };

    /**
     * Pagination handling for all lists
     */
    paginationManager: PaginationManager = new PaginationManager(
        'approved',
        'requests',
        'doctors'
    );
    // Default pagination settings
    defaultPageSize = 1;
    pageSizeOptions: number[] = [1, 2, 5, 10, 20, 50];
    @ViewChild('reqs_paginator', { static: false })
    reqsPaginator?: MatPaginator;
    @ViewChild('patients_paginator', { static: false })
    patientsPaginator?: MatPaginator;
    @ViewChild('doctors_paginator', { static: false })
    doctorsPaginator?: MatPaginator;

    ngAfterViewInit(): void {}
    private pageStartIndex(key: string) {
        const { pageIndex, pageSize } = this.paginationManager.get(key)!;
        return (pageIndex ?? 0) * (pageSize ?? this.defaultPageSize);
    }
    private pageEndIndex(key: string) {
        const { pageSize } = this.paginationManager.get(key)!;
        return this.pageStartIndex(key) + (pageSize ?? this.defaultPageSize);
    }
    // Gets called when user interacts with paginator
    updatePageIndex(key: string, event: PageEvent) {
        this.paginationManager.set(key, event);
    }
    // Recovers the unique index of an item in the original dataset
    getOriginalIndex(key: string, inPageIndex: number) {
        return this.pageStartIndex(key) + inPageIndex;
    }
    // Returns a page of the dataset
    getPage<T>(dataset: Array<T>, key: string) {
        // const startPage = this.pageStartIndex(key);
        // const endPage = this.pageEndIndex(key);
        return dataset.slice(this.pageStartIndex(key), this.pageEndIndex(key));
    }

    /**
     * Handle updates of the approved patients
     */
    patientUpdatesDisabled = true;
    profileUpdateHandlers = new ProfileUpdates(
        this.profileService,
        this.dialog
    );
    handleProfileEdited(
        array: User[],
        index: number,
        userChanges: Partial<User>
    ) {
        this.profileUpdateHandlers.updateProfile(
            array[index].id,
            userChanges,
            (user) => (array[index] = user),
            null,
            false
        );
    }

    handlePictureEdited(array: User[], index: number, event: PictureEvent) {
        if (event.action === 'edit') {
            this.profileUpdateHandlers.updateAvatar(
                array[index].id,
                event.picture,
                (user) => (array[index] = user),
                null,
                false
            );
        }
        if (event.action === 'delete') {
            return this.profileUpdateHandlers.deleteAvatar(
                array[index].id,
                (user) => (array[index] = user),
                null,
                false
            );
        }
    }

    /**
     * Handle requests for approval
     */
    handleApprove(index: number) {
        const { id, type } = this.patients.requests[index];
        this.profileUpdateHandlers.updateProfile(
            id,
            { type, status: 'active' },
            (user) => {
                this.reqsPaginator?.firstPage();
                this.patients.requests.splice(index, 1);
                this.patients.approved.push(user as Patient);
                if (this.patients.requests.length === 0) {
                    this.panelOpenStates['approved'] = true;
                    this.patientsPaginator?.lastPage();
                }
            },
            null,
            false,
            "Patient's registration has been approved.",
            "Failed to approve patient's registration."
        );
    }

    handleDeny(index: number) {
        const { id, type } = this.patients.requests[index];
        this.profileUpdateHandlers.updateProfile(
            id,
            { type, status: 'deleted' },
            () => {
                this.reqsPaginator?.firstPage();
                this.patients.requests.splice(index, 1);
            },
            null,
            false,
            "Patient's registration has been denied.",
            "Failed to deny patient's registration."
        );
    }

    /**
     * Handle user deletion
     */
    handleDelete(array: User[], index: number) {
        const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
            panelClass: 'dialog-color',
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (!result) return;
            this.profileUpdateHandlers.deleteProfile(array[index].id, () => {
                if (array === this.doctors) {
                    this.doctorsPaginator?.firstPage();
                }
                if (array === this.patients.approved) {
                    this.patientsPaginator?.firstPage();
                }
                array.splice(index, 1);
            });
        });
    }

    /**
     * Handle doctor creation
     */
    @ViewChild('doctor_creator', { static: false })
    createDoctorForm?: CreateDoctorComponent;
    handleCreateDoctor(
        doctor: Partial<Doctor> & { profile_picture: FileInput }
    ) {
        const formData = new FormData();
        for (const [key, value] of Object.entries(doctor)) {
            if (key !== 'profile_picture') {
                formData.append(key, value);
            }
        }
        const picture = doctor.profile_picture?.files?.[0];
        formData.append('profile_picture', picture ?? '');
        this.doctorService.register(formData).subscribe({
            next: (doctor) => {
                this.doctors.push(doctor);
                this.createDoctorForm?.clear();
                this.showDoctorCreationMessage({
                    success: true,
                    message: 'Doctor has been created successfully.',
                });
                this.panelOpenStates['doctors'] = true;
                this.doctorsPaginator?.lastPage();
            },
            error: (err) => {
                this.showDoctorCreationMessage({
                    success: false,
                    message: 'Failed to create doctor.',
                });
            },
        });
    }

    showDoctorCreationMessage(data: { success: boolean; message: string }) {
        this.dialog.open(DoctorCreationDialogComponent, {
            panelClass: 'dialog-color',
            data,
        });
    }

    handleClearCreateDoctor() {
        this.panelOpenStates['create-doctor'] = false;
    }
    ngOnDestroy(): void {}
}

/**
 * Manages the pagination state for expansion panels
 */
class PaginationManager {
    paginatorStates: Map<string, PageEvent> = new Map<string, PageEvent>();
    constructor(...keys: string[]) {
        keys.forEach((key) => {
            this.paginatorStates.set(key, new PageEvent());
        });
    }

    get(key: string) {
        return this.paginatorStates.get(key);
    }

    set(key: string, value: PageEvent) {
        this.paginatorStates.set(key, value);
    }
}

/**
 * Dialog for confirming user deletion
 */
@Component({
    selector: 'app-delete-user-dialog',
    template: ` <div
            class="d-flex align-items-baseline justify-content-center flex-wrap"
        >
            <mat-icon class="mx-1">warning</mat-icon>
            <h1 [style.text-align]="'center'">This action cannot be undone!</h1>
        </div>
        <div mat-dialog-content>
            <p>Are you sure you want to delete this user?</p>
        </div>
        <div mat-dialog-actions>
            <button
                mat-button
                [mat-dialog-close]="false"
                cdkFocusInitial
                color="green"
            >
                No
            </button>
            <button mat-button [mat-dialog-close]="true" color="warn">
                Yes
            </button>
        </div>`,
})
export class DeleteUserDialogComponent {
    constructor(public dialogRef: MatDialogRef<DeleteUserDialogComponent>) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}

@Component({
    selector: 'app-doctor-creation-dialog',
    template: ` <div class="d-flex align-items-center flex-wrap mb-2">
            <mat-icon class="mx-1" [color]="data.success ? 'green' : 'warn'">
                {{ data.success ? 'check_circle' : 'cancel' }}
            </mat-icon>
            <h1 [style.text-align]="'center'" class="mb-0">
                {{ data.success ? 'Success' : 'Failure' }}
            </h1>
        </div>
        <div mat-dialog-content>
            <p>{{ data.message }}</p>
        </div>
        <div mat-dialog-actions class="d-flex justify-content-center">
            <button mat-button mat-dialog-close cdkFocusInitial>Close</button>
        </div>`,
})
export class DoctorCreationDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<DoctorCreationDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { success: boolean; message: string }
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}
