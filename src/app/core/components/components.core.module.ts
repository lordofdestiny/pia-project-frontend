import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LayoutModule } from '@angular/cdk/layout';
import { MatRippleModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '@shared/services/auth.service';
import { LayoutComponent } from './layout/layout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PipesModule } from '@shared/pipes/pipes.shared.module';
import { FooterComponent } from './footer/footer.component';

@NgModule({
    declarations: [LayoutComponent, PageNotFoundComponent, FooterComponent],
    providers: [AuthService],
    imports: [
        CommonModule,
        RouterModule,
        LayoutModule,
        PipesModule,
        MatIconModule,
        MatListModule,
        MatSliderModule,
        MatRippleModule,
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
    ],
    exports: [LayoutComponent, FooterComponent],
})
export class CoreComponentsModule {}
