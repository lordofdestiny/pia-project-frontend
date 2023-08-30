import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { SharedModule } from '@shared/shared.module';
import { ChangePasswordComponent } from './change-password.component';

@NgModule({
    declarations: [ChangePasswordComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // Angular Material
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        // My modules
        SharedModule,
    ],
})
export class ChangePasswordModule {}
