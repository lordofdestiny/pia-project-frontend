import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MaterialFileInputModule } from 'ngx-material-file-input';

// PrimeNG
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { ImageModule } from 'primeng/image';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';

import { DebugPipe } from '@shared/pipes/debug.pipe';
import { HoldDirective } from '@shared/directives/hold.directive';
import { NgVarDirective } from '@shared/directives/ng-var.directive';
import { DoctorListComponent } from './components/doctor-list/doctor-list.component';
import { EditableProfileComponent } from './components/editable-profile/editable-profile.component';
import { MatErrMsgsComponent } from './components/mat-err-msgs/mat-err-msgs.component';
import { EditImageModalComponent } from './components/edit-image-modal/edit-image-modal.component';

@NgModule({
    declarations: [
        DoctorListComponent,
        EditableProfileComponent,
        DebugPipe,
        HoldDirective,
        NgVarDirective,
        MatErrMsgsComponent,
        EditImageModalComponent,
    ],
    providers: [],
    imports: [
        // Angular
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        // Angular Material
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        // PrimeNG
        KeyFilterModule,
        FormsModule,
        MessagesModule,
        MessageModule,
        InputTextModule,
        TableModule,
        ProgressBarModule,
        MultiSelectModule,
        DropdownModule,
        SliderModule,
        ImageModule,
        AvatarModule,
        AvatarGroupModule,
        ButtonModule,
        DynamicDialogModule,
        ConfirmDialogModule,
        TooltipModule,
        // Other
        MaterialFileInputModule,
    ],
    exports: [
        MatErrMsgsComponent,
        DoctorListComponent,
        EditableProfileComponent,
        DebugPipe,
        HoldDirective,
        NgVarDirective,
    ],
})
export class SharedModule {}
