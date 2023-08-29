import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import '@core/utils/array';
import '@core/utils/string';

import { SharedModule } from '@shared/shared.module';

import { AuthService } from './services/auth.service';
import { DoctorsService } from './services/doctors.service';
import { IsHandsetService } from './services/is-handset.service';
import { FooterComponent } from './components/footer/footer.component';
import { LayoutComponent } from './components/layout/layout.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { DoctorGuard } from './guards/doctor.guard';
import { LoggedInGurad } from './guards/loggedin.guard';
import { LogoutGuard } from './guards/logout.guard';
import { ManagerGuard } from './guards/manager.guard';
@NgModule({
    declarations: [FooterComponent, LayoutComponent, PageNotFoundComponent],
    providers: [
        AuthService,
        DoctorsService,
        IsHandsetService,
        AuthGuard,
        DoctorGuard,
        LoggedInGurad,
        LogoutGuard,
        ManagerGuard,
    ],
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatProgressBarModule,
    ],
    exports: [FooterComponent, LayoutComponent, PageNotFoundComponent],
})
export class CoreModule {}
