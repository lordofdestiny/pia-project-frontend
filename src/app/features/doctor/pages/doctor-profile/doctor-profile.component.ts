import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Examination } from '@core/models/specialization';

import { Doctor, User } from '@core/models/users';
import { DoctorExaminations } from '@core/resolvers/examinations.resolver';
import { AuthService } from '@core/services/auth.service';
import { ProfileService } from '@core/services/profile.service';
import { ProfileUpdates } from '@core/utils/profile-update-handlers';
import { PictureEvent } from '@shared/components/editable-profile/editable-profile.component';

@Component({
    selector: 'app-patient-profile',
    templateUrl: './doctor-profile.component.html',
    styleUrls: ['./doctor-profile.component.css'],
})
export class DoctorProfileComponent implements OnInit, OnDestroy {
    styles = {
        'font-size': '0.8rem',
    };
    user?: User;
    readonly userId = this.authService.user?.id;
    userSubscription = this.authService.user$.subscribe((user) => {
        this.user = user;
    });
    examinations: DoctorExaminations = this.route.snapshot.data['examinations'];
    constructor(
        public authService: AuthService,
        private profileService: ProfileService,
        private dialog: MatDialog,
        private route: ActivatedRoute
    ) {}

    profileUpdateHandlers = new ProfileUpdates(
        this.profileService,
        this.dialog
    );

    handleProfileEdited(userChanges: Partial<User>) {
        this.profileUpdateHandlers.updateProfile(
            this.userId,
            userChanges,
            null,
            () => {
                this.user = this.authService.user;
            }
        );
    }

    handlePictureEvent(event: PictureEvent) {
        switch (event.action) {
            case 'edit':
                return this.profileUpdateHandlers.updateAvatar(
                    this.userId,
                    event.picture
                );
            case 'delete':
                return this.profileUpdateHandlers.deleteAvatar(
                    this.userId,
                    null,
                    () => {
                        this.user = this.authService.user as Doctor;
                    }
                );
        }
    }

    ngOnInit(): void {}
    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }
}
