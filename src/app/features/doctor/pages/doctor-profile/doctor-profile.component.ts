import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Examination, Specialization } from '@core/models/specialization';

import { Doctor, User } from '@core/models/users';
import { AuthService } from '@core/services/auth.service';
import { DoctorService } from '@core/services/doctor.service';
import { ProfileService } from '@core/services/profile.service';
import { ProfileUpdates } from '@core/utils/profile-update-handlers';
import { PickExaminationsComponent } from '@features/doctor/components/pick-examinations/pick-examinations.component';
import { ActionResultDialogComponent } from '@shared/components/action-success-dialog/action-success-dialog.component';
import { PictureEvent } from '@shared/components/editable-profile/editable-profile.component';

@Component({
    selector: 'app-patient-profile',
    templateUrl: './doctor-profile.component.html',
    styleUrls: ['./doctor-profile.component.css'],
})
export class DoctorProfileComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    styles = {
        'font-size': '0.8rem',
    };
    user?: Doctor;
    readonly userId = this.authService.user?.id;
    userSubscription = this.authService.user$.subscribe((user) => {
        this.user = user as Doctor;
    });
    specialzations: Specialization[] =
        this.route.snapshot.data['specializations'];
    constructor(
        private dialog: MatDialog,
        private route: ActivatedRoute,
        public authService: AuthService,
        private profileService: ProfileService,
        private doctorsService: DoctorService
    ) {}

    profileUpdateHandlers = new ProfileUpdates(
        this.profileService,
        this.dialog
    );

    handleProfileEdited(userChanges: Partial<User>) {
        this.profileUpdateHandlers.updateProfile(
            this.userId,
            userChanges,
            (user) => {
                this.authService.user = user;
            },
            () => {
                this.user = this.authService.user as Doctor;
            }
        );
    }

    handlePictureEvent(event: PictureEvent) {
        switch (event.action) {
            case 'edit':
                return this.profileUpdateHandlers.updateAvatar(
                    this.userId,
                    event.picture,
                    (user) => {
                        this.authService.user.profile_picture = user;
                    },
                    () => {
                        this.user = this.authService.user as Doctor;
                    }
                );
            case 'delete':
                return this.profileUpdateHandlers.deleteAvatar(
                    this.userId,
                    (user) => {
                        this.authService.user.profile_picture = user;
                    },
                    () => {
                        this.user = this.authService.user as Doctor;
                    }
                );
        }
    }

    @ViewChild('examinations_picker')
    examinationsPicker?: PickExaminationsComponent;
    ngAfterViewInit() {}

    handleExaminationsSave(examinations: Examination[]) {
        const examinationIds = examinations.map(({ id }) => id);
        return this.doctorsService
            .update_examinations(this.userId, examinationIds)
            .subscribe({
                next: (result) => {
                    this.showDoctorCreationMessage({
                        success: true,
                        message: 'Examinations updated successfully',
                    });
                    this.user = this.authService.user as Doctor;
                    this.examinationsPicker?.confirmSave();
                },
                error: (err) => {
                    console.log(err);
                    this.showDoctorCreationMessage({
                        success: false,
                        message: 'Examinations update failed',
                    });
                    this.examinationsPicker?.rejectSave();
                },
            });
    }

    showDoctorCreationMessage(data: { success: boolean; message: string }) {
        this.dialog.open(ActionResultDialogComponent, {
            panelClass: 'dialog-color',
            data,
        });
    }

    ngOnInit(): void {}
    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }
}
