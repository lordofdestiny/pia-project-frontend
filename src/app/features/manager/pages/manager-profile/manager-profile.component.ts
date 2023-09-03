import {
    AfterViewInit,
    Component,
    OnInit,
    ViewChild,
    ViewRef,
} from '@angular/core';
import { User } from '@core/models/users';
import { AuthService } from '@core/services/auth.service';
import { ProfileService } from '@core/services/profile.service';
import {
    EditableProfileComponent,
    PictureEvent,
} from '@shared/components/editable-profile/editable-profile.component';

@Component({
    selector: 'app-patient-profile',
    host: { class: 'container' },
    template: `<div class="container">
        <app-editable-profile
            #editableProfile
            [_user]="authService.user$ | async"
            renderFor="manager"
            (profileEdited)="handleProfileEdited($event)"
            (pictureEdited)="handlePictureEvent($event)"
        ></app-editable-profile>
    </div>`,
})
export class ManagerProfileComponent implements OnInit, AfterViewInit {
    @ViewChild('editableProfile') editableProfile?: EditableProfileComponent;
    constructor(
        public authService: AuthService,
        private profileService: ProfileService
    ) {}

    handleProfileEdited(user: User) {
        console.log('profile edited');
        this.editableProfile!._user = Object.assign({}, user);
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
        const formData = new FormData(document.forms[0]);
        formData.append('profile_picture', picture);
        this.profileService.update_avatar(formData).subscribe({
            error: (err) => {
                alert('Error updating profile picture');
            },
        });
    }

    private handlePictureDelete() {
        this.profileService.delete_avatar().subscribe({
            error: (err) => {
                alert('Error deleting profile picture');
            },
        });
    }

    ngOnInit(): void {}
    ngAfterViewInit(): void {}
}
