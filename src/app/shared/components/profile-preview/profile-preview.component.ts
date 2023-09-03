import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { User } from '@core/models/users';

import { FieldErrorMessagesService } from '@core/services/field-error-messages.service';
import { FieldBase, baseFieldConfig } from '@core/utils/profile-fields';
import { Observable, map, of } from 'rxjs';

@Component({
    selector: 'app-profile-preview',
    templateUrl: './profile-preview.component.html',
    styleUrls: ['./profile-preview.component.css'],
})
export class ProfilePreviewComponent implements OnChanges {
    @Input() user: User = {} as User;
    @Input() styles: any;
    @Input() fontSize: string = '1.3rem';
    constructor(
        private fb: FormBuilder,
        public errorMessages: FieldErrorMessagesService
    ) {}

    fieldsConfig: FieldBase<string>[] = [];
    matcher = new ShowOnDirtyErrorStateMatcher();
    imgLoading = true;
    imageLoaded() {
        this.imgLoading = false;
    }

    get user$() {
        return of(this.user);
    }

    get formEdited() {
        return of(false);
    }

    resetField(key: string) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['user'].isFirstChange()) {
            this.fieldsConfig = baseFieldConfig(
                changes['user'].currentValue.type,
                'patient'
            );
        }
    }
}
