import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SharedModule } from '@shared/shared.module';

import { NewVisitorRoutingModule } from './new-visitor-routing.module';
import { NewVisitorComponent } from './new-visitor.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { AboutGalleryComponent } from './components/about-gallery/about-gallery.component';
import {
    UniqueEmailValidator,
    UniqueUsernameValidator,
} from './pages/register-page/unique-creds.validator';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

import { MaterialFileInputModule } from 'ngx-material-file-input';

@NgModule({
    declarations: [
        CarouselComponent,
        AboutGalleryComponent,
        RegisterPageComponent,
        LoginPageComponent,
        NewVisitorComponent,
    ],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { showError: true, displayDefaultIndicatorType: false },
        },
        UniqueEmailValidator,
        UniqueUsernameValidator,
    ],
    imports: [
        // Angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // Angular Material
        MatListModule,
        MatButtonModule,
        MatDividerModule,
        MatCardModule,
        MatIconModule,
        MatStepperModule,
        MatInputModule,
        MatFormFieldModule,
        // Ngx-material-file-input
        MaterialFileInputModule,
        // Ngx-bootstrap
        ModalModule.forRoot(),
        CarouselModule.forRoot(),
        // My modules
        SharedModule,
        NewVisitorRoutingModule,
    ],
    exports: [],
})
export class NewVisitorModule {}
