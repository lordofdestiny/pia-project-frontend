import { MatDialog } from '@angular/material/dialog';
import { User } from '@core/models/users';
import { ProfileService } from '@core/services/profile.service';
import { ProfileUpdatedDialogComponent } from '@shared/components/profile-update-dialog/profiile-update-dialog.component';
import {
    resolveProfilePicture,
    resolveProfilePicturePath,
} from './resolveProfilePicture';

export class ProfileUpdates {
    constructor(
        private profileService: ProfileService,
        private dialog: MatDialog
    ) {}

    messages = {
        success: 'Profile updated successfully',
        failed: 'Profile update failed. Please try again later',
        picture_success: 'Profile picture updated successfully',
        picture_failed:
            'Failed to update the profile picture. Please try again later',
        picture_removed_success: 'Profile picture removed successfully',
        picture_removed_failed:
            'Failed to remove the profile picture. Please try again later',
        success_delete: 'User deleted successfully',
        failed_delete: 'Failed to delete this user. Please try again later',
    };

    updateProfile(
        userId: string,
        userChanges: Partial<User>,
        onSuccess?: ((user: User) => void) | null,
        onError?: ((err: any) => void) | null,
        successMessage = this.messages.success,
        failedMessage = this.messages.failed
    ) {
        this.profileService.update_profile(userId, userChanges).subscribe({
            next: (user) => {
                ProfileUpdatedDialogComponent.displaySuccessDialog(
                    successMessage,
                    this.dialog
                );
                resolveProfilePicture(user);
                if (onSuccess) onSuccess(user);
            },
            error: (err) => {
                ProfileUpdatedDialogComponent.displayFailedDialog(
                    failedMessage,
                    this.dialog
                );
                if (onError) onError(err);
            },
        });
    }

    deleteProfile(
        userId: string,
        onSuccess?: (() => void) | null,
        onError?: ((err: any) => void) | null,
        successMessage = this.messages.success_delete,
        failedMessage = this.messages.failed_delete
    ) {
        this.profileService.delete_profile(userId).subscribe({
            next: () => {
                ProfileUpdatedDialogComponent.displaySuccessDialog(
                    successMessage,
                    this.dialog
                );
                if (onSuccess) onSuccess();
            },
            error: (err) => {
                ProfileUpdatedDialogComponent.displayFailedDialog(
                    failedMessage,
                    this.dialog
                );
                if (onError) onError(err);
            },
        });
    }

    updateAvatar(
        userId: string,
        picture: File,
        onSuccess?: ((newPicture: string) => void) | null,
        onError?: ((err: any) => void) | null,
        successMessage = this.messages.picture_success,
        failedMessage = this.messages.picture_failed
    ) {
        const formData = new FormData();
        formData.append('profile_picture', picture);
        this.profileService.update_avatar(userId, formData).subscribe({
            next: ({ profile_picture: newPicture }) => {
                ProfileUpdatedDialogComponent.displaySuccessDialog(
                    successMessage,
                    this.dialog
                );
                if (onSuccess) onSuccess(resolveProfilePicturePath(newPicture));
            },
            error: (err) => {
                ProfileUpdatedDialogComponent.displayFailedDialog(
                    failedMessage,
                    this.dialog
                );
                if (onError) onError(err);
            },
        });
    }

    deleteAvatar(
        userId: string,
        onSuccess?: ((newPicture: string) => void) | null,
        onError?: ((err: any) => void) | null,
        successMessage = this.messages.picture_removed_success,
        failedMessage = this.messages.picture_removed_failed
    ) {
        this.profileService.delete_avatar(userId).subscribe({
            next: ({ profile_picture: newPicture }) => {
                ProfileUpdatedDialogComponent.displaySuccessDialog(
                    successMessage,
                    this.dialog
                );
                if (onSuccess) onSuccess(resolveProfilePicturePath(newPicture));
            },
            error: (err) => {
                ProfileUpdatedDialogComponent.displayFailedDialog(
                    failedMessage,
                    this.dialog
                );
                if (onError) onError(err);
            },
        });
    }
}
