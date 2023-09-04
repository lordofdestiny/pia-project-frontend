import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { User } from '@core/models/users';
import { FieldBase, baseFieldConfig } from '@core/utils/profile-fields';

@Component({
    selector: 'app-profile-preview',
    templateUrl: './profile-preview.component.html',
    styleUrls: ['./profile-preview.component.css'],
})
export class ProfilePreviewComponent implements OnChanges {
    @Input() user: User = {} as User;
    @Input() styles: any = {};
    constructor() {}

    imgLoading = true;
    imageLoaded() {
        this.imgLoading = false;
    }

    fieldsConfig: FieldBase<string>[] = [];
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['user'].isFirstChange()) {
            this.fieldsConfig = baseFieldConfig(
                changes['user'].currentValue.type,
                'patient'
            );
        }
    }
}
