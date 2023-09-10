import { NgModule } from "@angular/core";
import { CommonModule, NgStyle } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Angular Material
import { MatNativeDateModule, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";

import { MaterialFileInputModule } from "ngx-material-file-input";

// PrimeNG
import { KeyFilterModule } from "primeng/keyfilter";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ProgressBarModule } from "primeng/progressbar";
import { MultiSelectModule } from "primeng/multiselect";
import { DropdownModule } from "primeng/dropdown";
import { SliderModule } from "primeng/slider";
import { ImageModule } from "primeng/image";
import { AvatarModule } from "primeng/avatar";
import { AvatarGroupModule } from "primeng/avatargroup";
import { ButtonModule } from "primeng/button";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TooltipModule } from "primeng/tooltip";

import { DebugPipe } from "@shared/pipes/debug.pipe";
import { HoldDirective } from "@shared/directives/hold.directive";
import { NgVarDirective } from "@shared/directives/ng-var.directive";
import { BackButtonDirective } from "@shared/directives/back-button.directive";
import { DoctorListComponent } from "@shared/components/doctor-list/doctor-list.component";
import { EditableProfileComponent } from "@shared/components/editable-profile/editable-profile.component";
import { MatErrMsgsComponent } from "@shared/components/mat-err-msgs/mat-err-msgs.component";
import { EditImageComponent } from "./components/edit-image/edit-image.component";
import { ProfileUpdatedDialogComponent } from "./components/profile-update-dialog/profiile-update-dialog.component";
import { MindurationPipe } from "./pipes/minduration.pipe";
import { ActionResultDialogComponent } from "./components/action-success-dialog/action-success-dialog.component";
import {
    ExaminationsListButtonsDirective,
    ExaminationsListComponent,
} from "@shared/components/examinations-list/examinations-list.component";
import { FullNamePipe } from "./pipes/full-name.pipe";

@NgModule({
    declarations: [
        DebugPipe,
        FullNamePipe,
        MindurationPipe,
        HoldDirective,
        NgVarDirective,
        BackButtonDirective,
        MatErrMsgsComponent,
        EditableProfileComponent,
        EditImageComponent,
        DoctorListComponent,
        ProfileUpdatedDialogComponent,
        ActionResultDialogComponent,
        ExaminationsListButtonsDirective,
        ExaminationsListComponent,
    ],

    imports: [
        // Angular
        CommonModule,
        RouterModule,
        FormsModule,
        NgStyle,
        ReactiveFormsModule,
        // Angular Material
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatDialogModule,
        MatButtonModule,
        MatTableModule,
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
        EditableProfileComponent,
        DoctorListComponent,
        BackButtonDirective,
        ActionResultDialogComponent,
        ExaminationsListButtonsDirective,
        ExaminationsListComponent,
        DebugPipe,
        FullNamePipe,
        MindurationPipe,
        HoldDirective,
        NgVarDirective,
    ],
})
export class SharedModule {}
