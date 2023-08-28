import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { ModalModule } from 'ngx-bootstrap/modal';

import { SharedDirectivesModule } from '@shared/directives/directives.shared.module';
import { PipesModule } from '@shared/pipes/pipes.shared.module';

import { RegisterPageComponent } from './register-page.component';
import {
    UniqueEmailValidator,
    UniqueUsernameValidator,
} from './unique-creds.validator';

@NgModule({
    declarations: [RegisterPageComponent],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { showError: true, displayDefaultIndicatorType: false },
        },
        UniqueEmailValidator,
        UniqueUsernameValidator,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        MatCardModule,
        MatIconModule,
        MatStepperModule,
        NgxMatFileInputModule,
        SharedDirectivesModule,
        PipesModule,
        ModalModule.forRoot(),
    ],
    exports: [RegisterPageComponent, SharedDirectivesModule],
    bootstrap: [RegisterPageComponent],
})
export class RegisterPageModule {}
