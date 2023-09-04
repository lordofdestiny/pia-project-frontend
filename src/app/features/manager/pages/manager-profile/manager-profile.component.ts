import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Manager, User } from '@core/models/users';
import { AuthService } from '@core/services/auth.service';
import { ProfileService } from '@core/services/profile.service';
import { PictureEvent } from '@shared/components/editable-profile/editable-profile.component';
import { ProfileUpdatedDialogComponent } from '@shared/components/profile-update-dialog/profiile-update-dialog.component';

@Component({
    selector: 'app-patient-profile',
    host: { class: 'container' },
    template: `<div class="container">
        <app-editable-profile
            [(user)]="user"
            renderFor="manager"
            (profileEdited)="handleProfileEdited($event)"
            (pictureEdited)="handlePictureEvent($event)"
        >
        </app-editable-profile>
    </div>`,
})
export class ManagerProfileComponent implements OnInit {
    user?: User;
    userSubscription = this.authService.user$.subscribe((user) => {
        this.user = user;
    });
    constructor(
        public authService: AuthService,
        private profileService: ProfileService,
        private dialog: MatDialog
    ) {}

    handleProfileEdited(userChanges: Partial<User>) {
        console.log(userChanges);
        this.profileService.update_profile(userChanges).subscribe({
            next: (user) => {
                ProfileUpdatedDialogComponent.displayProfileUpdateSuccessDialog(
                    'Profile updated successfully',
                    this.dialog
                );
            },
            error: (err) => {
                ProfileUpdatedDialogComponent.displayProfileUpdateFailedDialog(
                    'Profile update failed. Please try again later',
                    this.dialog
                );
                this.user = this.authService.user;
            },
        });
    }

    handlePictureEvent(event: PictureEvent) {
        switch (event.action) {
            case 'edit':
                return this.handlePictureEdit(event.picture);
            case 'delete':
                return this.handlePictureDelete();
        }
    }

    private handlePictureEdit(picture: File) {
        const formData = new FormData();
        formData.append('profile_picture', picture);
        this.profileService.update_avatar(formData).subscribe({
            next: (user) => {
                ProfileUpdatedDialogComponent.displayProfileUpdateSuccessDialog(
                    'Profile picture updated successfully',
                    this.dialog
                );
            },
            error: (err) => {
                ProfileUpdatedDialogComponent.displayProfileUpdateFailedDialog(
                    'Failed to update the profile picture. Please try again later',
                    this.dialog
                );
            },
        });
    }

    private handlePictureDelete() {
        this.profileService.delete_avatar().subscribe({
            next: (user) => {
                ProfileUpdatedDialogComponent.displayProfileUpdateSuccessDialog(
                    'Profile picture removed successfully',
                    this.dialog
                );
            },
            error: (err) => {
                ProfileUpdatedDialogComponent.displayProfileUpdateFailedDialog(
                    'Failed to remove the profile picture. Please try again later',
                    this.dialog
                );
                this.user = this.authService.user;
            },
        });
    }

    ngOnInit(): void {}
}
