import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatStepperModule } from "@angular/material/stepper";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";

import { CarouselModule } from "ngx-bootstrap/carousel";
import { ModalModule } from "ngx-bootstrap/modal";
import { MaterialFileInputModule } from "ngx-material-file-input";

import { SharedModule } from "@shared/shared.module";

import { UserAuthRoutingModule } from "@features/user-auth/user-auth-routing.module";
import { RegisterPageComponent } from "@features/user-auth/pages/register-page/register-page.component";
import { LoginPageComponent } from "@features/user-auth/pages/login-page/login-page.component";
import { EditPasswordComponent } from "./pages/edit-password/edit-password.component";

@NgModule({
    declarations: [RegisterPageComponent, LoginPageComponent, EditPasswordComponent],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { showError: true, displayDefaultIndicatorType: false },
        },
    ],
    imports: [
        // Angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // Angular Material
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatStepperModule,
        MatInputModule,
        MatFormFieldModule,
        MatDialogModule,
        // Ngx-material-file-input
        MaterialFileInputModule,
        // Ngx-bootstrap
        ModalModule.forRoot(),
        CarouselModule.forRoot(),
        // My modules
        SharedModule,
        UserAuthRoutingModule,
    ],
    exports: [],
})
export class UserAuthModule {}
