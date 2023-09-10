import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { User } from "@core/models/users";
import { AuthService } from "@core/services/auth.service";
import { ProfileService } from "@core/services/profile.service";
import { ProfileUpdates } from "@core/utils/profile-update-handlers";
import { PictureEvent } from "@shared/components/editable-profile/editable-profile.component";

@Component({
    selector: "app-patient-profile",
    host: { class: "container" },
    template: `<div class="container">
        <app-editable-profile
            [(user)]="user"
            [styles]="styles"
            renderFor="patient"
            (profileEdited)="handleProfileEdited($event)"
            (pictureEdited)="handlePictureEvent($event)">
        </app-editable-profile>
    </div>`,
})
export class PatientProfileComponent implements OnInit, OnDestroy {
    readonly userId = this.authService.user?.id;
    user?: User;
    userSubscription = this.authService.user$.subscribe((user) => {
        this.user = user;
    });
    constructor(
        public authService: AuthService,
        private profileService: ProfileService,
        private dialog: MatDialog
    ) {}
    styles = {
        "font-size": "0.8rem",
    };
    profileUpdateHandlers = new ProfileUpdates(this.profileService, this.dialog);

    handleProfileEdited(userChanges: Partial<User>) {
        this.profileUpdateHandlers.updateProfile(
            this.userId,
            userChanges,
            (user) => {
                this.authService.user = user;
            },
            () => {
                this.user = this.authService.user;
            }
        );
    }

    handlePictureEvent(event: PictureEvent) {
        switch (event.action) {
            case "edit":
                return this.profileUpdateHandlers.updateAvatar(
                    this.userId,
                    event.picture,
                    (user) => {
                        this.authService.user.profile_picture = user;
                    },
                    () => {
                        this.user = this.authService.user;
                    }
                );
            case "delete":
                return this.profileUpdateHandlers.deleteAvatar(
                    this.userId,
                    (user) => {
                        this.authService.user.profile_picture = user;
                    },
                    () => {
                        this.user = this.authService.user;
                    }
                );
        }
    }

    ngOnInit(): void {}
    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }
}
